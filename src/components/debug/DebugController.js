/**
 * DebugController Component
 * 
 * A component that provides debugging controls and monitoring
 * for the FlavorMind app, particularly useful for tracking
 * issues with expiring items and filter states.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';
import Config from '../../constants/config';
import { setDebugCategory, setDebugEnabled } from '../../utils/debug/logger';
import { logUI, logFilter } from '../../utils/debug/logger';

const DebugController = () => {
  // Get context data
  const { 
    pantryItems, 
    getExpiringItems, 
    getExpiredItems,
    forceExpiryRefresh
  } = useAppContext();
  
  // Local state
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('status');
  const [masterDebug, setMasterDebug] = useState(true);
  const [stateDebug, setStateDebug] = useState(true);
  const [filtersDebug, setFiltersDebug] = useState(true);
  const [datesDebug, setDatesDebug] = useState(true);
  
  // Force a refresh of all data when the debug panel is opened
  useEffect(() => {
    if (visible) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        logUI('Debug panel opened, forcing refresh');
        forceExpiryRefresh();
      }, 100);
    }
  }, [visible, forceExpiryRefresh]);
  
  // Handle debug settings changes
  useEffect(() => {
    setDebugEnabled(masterDebug);
  }, [masterDebug]);
  
  useEffect(() => {
    setDebugCategory('state', stateDebug);
  }, [stateDebug]);
  
  useEffect(() => {
    setDebugCategory('filters', filtersDebug);
  }, [filtersDebug]);
  
  useEffect(() => {
    setDebugCategory('dates', datesDebug);
  }, [datesDebug]);
  
  // Calculate statistics for monitoring
  const expiringItems = getExpiringItems();
  const expiredItems = getExpiredItems();
  
  // Debug the current data directly
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate warning date (today + warning days)
    const warningDate = new Date(today);
    warningDate.setDate(today.getDate() + Config.app.expiryWarningDays);
    warningDate.setHours(23, 59, 59, 999);
    
    // Log current state for debugging
    console.log('[DEBUG-CONTROLLER] Current status:', {
      currentDate: today,
      currentTimestamp: today.getTime(),
      warningDate: warningDate,
      warningTimestamp: warningDate.getTime(),
      expiryWarningDays: Config.app.expiryWarningDays,
      totalItems: pantryItems.length,
      expiringItems: expiringItems.map(i => ({ name: i.name, expiry: i.expiry, date: new Date(i.expiry) })),
      expiredItems: expiredItems.map(i => ({ name: i.name, expiry: i.expiry, date: new Date(i.expiry) })),
    });
  }, [pantryItems, visible]);
    
  // Check for date parsing issues
  const itemsWithDateIssues = pantryItems.filter(item => {
    const expiryDate = new Date(item.expiry);
    return isNaN(expiryDate.getTime());
  });
  
  // Toggle debug controller visibility
  const toggleVisible = () => {
    setVisible(!visible);
  };
  
  // Render debug controller button
  const renderButton = () => (
    <TouchableOpacity 
      style={styles.debugButton}
      onPress={toggleVisible}
    >
      <Ionicons 
        name="bug-outline" 
        size={24} 
        color={Colors.textPrimary} 
      />
    </TouchableOpacity>
  );
  
  // Render debug tabs
  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'status' && styles.activeTab]}
        onPress={() => setActiveTab('status')}
      >
        <Text style={[styles.tabText, activeTab === 'status' && styles.activeTabText]}>
          Status
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'expiring' && styles.activeTab]}
        onPress={() => setActiveTab('expiring')}
      >
        <Text style={[styles.tabText, activeTab === 'expiring' && styles.activeTabText]}>
          Expiring
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
        onPress={() => setActiveTab('settings')}
      >
        <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render debug content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'status':
        return renderStatusTab();
      case 'expiring':
        return renderExpiringTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return null;
    }
  };
  
  // Render Status tab content
  const renderStatusTab = () => (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Pantry Overview</Text>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Total Items:</Text>
        <Text style={styles.statValue}>{pantryItems.length}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Expiring Soon:</Text>
        <Text style={[styles.statValue, expiringItems.length > 0 && styles.warningText]}>
          {expiringItems.length}
        </Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Expired:</Text>
        <Text style={[styles.statValue, expiredItems.length > 0 && styles.errorText]}>
          {expiredItems.length}
        </Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Items with Date Issues:</Text>
        <Text style={[styles.statValue, itemsWithDateIssues.length > 0 && styles.errorText]}>
          {itemsWithDateIssues.length}
        </Text>
      </View>
      
      <Text style={styles.sectionTitle}>App Configuration</Text>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Expiry Warning Days:</Text>
        <Text style={styles.statValue}>{Config.app.expiryWarningDays}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Default Expiry Days:</Text>
        <Text style={styles.statValue}>{Config.app.defaultExpiryDays}</Text>
      </View>
    </ScrollView>
  );
  
  // Render Expiring tab content
  const renderExpiringTab = () => {
    // Force recalculation of expiring and expired items
    const recalculatedExpiringItems = getExpiringItems();
    const recalculatedExpiredItems = getExpiredItems();
    
    return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Expiring Soon Items ({recalculatedExpiringItems.length})</Text>
      
      {recalculatedExpiringItems.length > 0 ? (
        <FlatList
          data={recalculatedExpiringItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItemRow(item, 'expiring')}
        />
      ) : (
        <Text style={styles.emptyText}>No items expiring soon</Text>
      )}
      
      <Text style={styles.sectionTitle}>Expired Items ({recalculatedExpiredItems.length})</Text>
      
      {recalculatedExpiredItems.length > 0 ? (
        <FlatList
          data={recalculatedExpiredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItemRow(item, 'expired')}
        />
      ) : (
        <Text style={styles.emptyText}>No expired items</Text>
      )}
      
      {itemsWithDateIssues.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Items with Date Issues ({itemsWithDateIssues.length})</Text>
          <FlatList
            data={itemsWithDateIssues}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderItemRow(item, 'issue')}
          />
        </>
      )}
    </View>
    );
  };
  
  // Render item row for expiring/expired items
  const renderItemRow = (item, type) => {
    // Get current date and normalize to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse expiry date and normalize to midnight for comparison
    const expiryDate = new Date(item.expiry);
    expiryDate.setHours(0, 0, 0, 0);
    
    // Calculate warning date (today + warning days)
    const warningDate = new Date(today);
    warningDate.setDate(today.getDate() + Config.app.expiryWarningDays);
    warningDate.setHours(23, 59, 59, 999);
    
    // Calculate differences for display
    const diffDays = Math.round((expiryDate - today) / (1000 * 60 * 60 * 24));
    const isAfterToday = expiryDate.getTime() >= today.getTime();
    const isBeforeWarning = expiryDate.getTime() <= warningDate.getTime();
    const isExpiring = isAfterToday && isBeforeWarning;
    
    // Debugging checks
    const shouldBeExpiring = isExpiring;
    const shouldBeExpired = expiryDate.getTime() < today.getTime();
    const actuallyInCorrectCategory = 
      (type === 'expiring' && shouldBeExpiring) || 
      (type === 'expired' && shouldBeExpired) || 
      (type === 'issue');
    
    return (
      <View style={[styles.itemRow, !actuallyInCorrectCategory && styles.itemRowIncorrect]}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemInfo} numberOfLines={2}>
          {item.expiry} 
          {type !== 'issue' && ` (${diffDays} days)`}
          {!actuallyInCorrectCategory && '\n⚠️ Category mismatch!'}
        </Text>
        {type === 'expiring' && (
          <View style={[styles.itemBadge, styles.expiringBadge]}>
            <Text style={styles.itemBadgeText}>Soon</Text>
          </View>
        )}
        {type === 'expired' && (
          <View style={[styles.itemBadge, styles.expiredBadge]}>
            <Text style={styles.itemBadgeText}>Expired</Text>
          </View>
        )}
        {type === 'issue' && (
          <View style={[styles.itemBadge, styles.issueBadge]}>
            <Text style={styles.itemBadgeText}>Issue</Text>
          </View>
        )}
      </View>
    );
  };
  
  // Render Settings tab content
  const renderSettingsTab = () => (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Debug Settings</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Master Debug Switch</Text>
        <Switch
          value={masterDebug}
          onValueChange={setMasterDebug}
          trackColor={{ false: Colors.border, true: Colors.primary }}
        />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>State Debugging</Text>
        <Switch
          value={stateDebug}
          onValueChange={setStateDebug}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          disabled={!masterDebug}
        />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Filters Debugging</Text>
        <Switch
          value={filtersDebug}
          onValueChange={setFiltersDebug}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          disabled={!masterDebug}
        />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Date Calculations Debugging</Text>
        <Switch
          value={datesDebug}
          onValueChange={setDatesDebug}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          disabled={!masterDebug}
        />
      </View>
    </ScrollView>
  );
  
  return (
    <>
      {renderButton()}
      
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.debugPanel}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Debug Controller</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            {renderTabs()}
            {renderContent()}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  debugButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  debugPanel: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    padding: 4,
    margin: 12,
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.textPrimary,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  warningText: {
    color: Colors.warning,
  },
  errorText: {
    color: Colors.error,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemRowIncorrect: {
    backgroundColor: Colors.error + '15', // Light red background for incorrect items
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  itemInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  itemBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  expiringBadge: {
    backgroundColor: Colors.warning + '30',
  },
  expiredBadge: {
    backgroundColor: Colors.error + '30',
  },
  issueBadge: {
    backgroundColor: Colors.gray300,
  },
  itemBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
});

export default DebugController;