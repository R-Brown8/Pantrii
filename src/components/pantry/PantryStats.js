/**
 * PantryStats Component
 * 
 * Displays statistics and actionable information about pantry items.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Card from '../ui/Card';
import { getExpiryStatus } from '../../utils/dateUtils';

const PantryStats = ({ 
  pantryItems, 
  onViewExpiring, 
  onViewExpired 
}) => {
  // Calculate statistics
  const stats = useMemo(() => {
    // Count by status
    const counts = {
      total: pantryItems.length,
      expired: 0,
      expiring: 0, // Expiring today or tomorrow
      warning: 0,   // Expiring within the warning period
    };
    
    // Count items by expiry status
    pantryItems.forEach(item => {
      const status = getExpiryStatus(item.expiry).status;
      
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    
    return counts;
  }, [pantryItems]);
  
  // Skip rendering if no items
  if (stats.total === 0) {
    return null;
  }
  
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Pantry Overview</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, styles.totalIcon]}>
            <Ionicons name="basket" size={20} color={Colors.textLight} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.statItem}
          onPress={onViewExpiring}
          disabled={!onViewExpiring || (stats.expiring + stats.warning) === 0}
        >
          <View style={[styles.statIcon, styles.warningIcon]}>
            <Ionicons name="alarm" size={20} color={Colors.textLight} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{stats.expiring + stats.warning}</Text>
            <Text style={styles.statLabel}>Expiring Soon</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.statItem}
          onPress={onViewExpired}
          disabled={!onViewExpired || stats.expired === 0}
        >
          <View style={[styles.statIcon, styles.expiredIcon]}>
            <Ionicons name="alert-circle" size={20} color={Colors.textLight} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{stats.expired}</Text>
            <Text style={styles.statLabel}>Expired</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Expiration Alerts */}
      {stats.expiring > 0 && (
        <View style={[styles.alert, styles.expiringAlert]}>
          <Ionicons name="time" size={20} color={Colors.warning} style={styles.alertIcon} />
          <Text style={styles.alertText}>
            <Text style={styles.alertBold}>{stats.expiring} {stats.expiring === 1 ? 'item' : 'items'}</Text> expiring today or tomorrow
          </Text>
        </View>
      )}
      
      {stats.expired > 0 && (
        <View style={[styles.alert, styles.expiredAlert]}>
          <Ionicons name="alert-circle" size={20} color={Colors.error} style={styles.alertIcon} />
          <Text style={styles.alertText}>
            <Text style={styles.alertBold}>{stats.expired} {stats.expired === 1 ? 'item' : 'items'}</Text> in your pantry {stats.expired === 1 ? 'has' : 'have'} expired
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  totalIcon: {
    backgroundColor: Colors.primary,
  },
  warningIcon: {
    backgroundColor: Colors.warning,
  },
  expiredIcon: {
    backgroundColor: Colors.error,
  },
  statContent: {
    flexDirection: 'column',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  expiringAlert: {
    backgroundColor: Colors.warning + '15', // 15 = ~8% opacity in hex
  },
  expiredAlert: {
    backgroundColor: Colors.error + '15', // 15 = ~8% opacity in hex
  },
  alertIcon: {
    marginRight: 8,
  },
  alertText: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  alertBold: {
    fontWeight: '700',
  },
});

export default PantryStats;
