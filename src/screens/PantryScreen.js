/**
 * PantryScreen
 * 
 * Main screen for pantry inventory management.
 * This is a central feature of MVP 2, enhanced for Pantrii 5.5.1.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  SectionList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Colors from '../constants/colors';
import Config from '../constants/config';
import { logUI, logFilter, logLifecycle } from '../utils/debug/logger';

// Import components
import PantryItemRow from '../components/pantry/PantryItemRow';
import PantryItemForm from '../components/pantry/PantryItemForm';
import PantryStats from '../components/pantry/PantryStats';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SmartRecipeButton from '../components/meal/SmartRecipeButton';

const PantryScreen = ({ navigation }) => {
  // Reference to track component renders
  const renderCount = useRef(0);
  
  // Log when component renders
  useEffect(() => {
    renderCount.current++;
    logLifecycle(`PantryScreen rendered (${renderCount.current} times)`);
    
    return () => {
      logLifecycle('PantryScreen unmounted');
    };
  }, []);
  // Get data and actions from context
  const { 
    pantryItems, 
    categories,
    isLoading, 
    addPantryItem, 
    updatePantryItem, 
    removePantryItem,
    getExpiringItems,
    getExpiredItems
  } = useAppContext();
  
  // Local state for UI
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'expiring', 'expired'
  const [categoryFilter, setCategoryFilter] = useState(null);
  
  // Track previous filter type for debugging
  const prevFilterTypeRef = useRef(filterType);
  
  // Log filter changes
  useEffect(() => {
    if (prevFilterTypeRef.current !== filterType) {
      logFilter('Filter type changed', { 
        from: prevFilterTypeRef.current, 
        to: filterType 
      });
      prevFilterTypeRef.current = filterType;
    }
  }, [filterType]);
  
  // Track pantry items and expiring items for debugging
  useEffect(() => {
    if (pantryItems.length > 0) {
      const expiringCount = getExpiringItems().length;
      const expiredCount = getExpiredItems().length;
      
      logFilter('Pantry items updated', { 
        totalItems: pantryItems.length,
        expiringCount,
        expiredCount,
        currentFilter: filterType
      });
    }
  }, [pantryItems]);
  
  // Calculate filtered and sorted items
  const filteredItems = useMemo(() => {
    logFilter('Calculating filtered items', {
      searchQuery,
      filterType,
      categoryFilter,
      totalItems: pantryItems.length
    });
    let items = [...pantryItems];
    
    // Apply search filter
    if (searchQuery) {
      logFilter('Applying search filter', { query: searchQuery });
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (filterType === 'expiring') {
      logFilter('Applying expiring filter');
      items = getExpiringItems();
    } else if (filterType === 'expired') {
      logFilter('Applying expired filter');
      items = getExpiredItems();
    }
    
    // Apply category filter
    if (categoryFilter) {
      items = items.filter(item => item.categoryId === categoryFilter);
    }
    
    logFilter('Filtered items result', { count: items.length });
    return items;
  }, [pantryItems, searchQuery, filterType, categoryFilter]);
  
  // Add category names to items for display
  const itemsWithCategories = useMemo(() => {
    // Create category lookup map
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });
    
    // Add category names to items
    return filteredItems.map(item => ({
      ...item,
      categoryName: item.categoryId ? categoryMap[item.categoryId] : 'Uncategorized'
    }));
  }, [filteredItems, categories]);
  
  // Group items for section list (by category or alphabetically)
  const groupedItems = useMemo(() => {
    if (filterType === 'all' && !searchQuery && !categoryFilter) {
      // Group by category when no filters are applied
      const grouped = {};
      
      // Initialize with all categories
      categories.forEach(cat => {
        grouped[cat.id] = {
          title: cat.name,
          icon: cat.icon,
          data: []
        };
      });
      
      // Add uncategorized group
      grouped['uncategorized'] = {
        title: 'Uncategorized',
        icon: 'help-circle',
        data: []
      };
      
      // Group items by category
      itemsWithCategories.forEach(item => {
        const categoryId = item.categoryId || 'uncategorized';
        if (grouped[categoryId]) {
          grouped[categoryId].data.push(item);
        } else {
          grouped['uncategorized'].data.push(item);
        }
      });
      
      // Convert to array and remove empty categories
      return Object.values(grouped)
        .filter(group => group.data.length > 0)
        .sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Group alphabetically when filters are applied
      const grouped = {};
      
      itemsWithCategories.forEach(item => {
        const firstLetter = item.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
          grouped[firstLetter] = {
            title: firstLetter,
            data: []
          };
        }
        grouped[firstLetter].data.push(item);
      });
      
      return Object.values(grouped).sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [itemsWithCategories, categories, filterType, searchQuery, categoryFilter]);
  
  // Handle adding a new item
  const handleAddItem = (item) => {
    logUI('Adding new pantry item', { 
      name: item.name,
      expiry: item.expiry,
      expiryStatus: new Date(item.expiry) < new Date() ? 'expired' : 'valid'
    });
    // Add the item
    addPantryItem(item);
    
    // Debug filtered items after adding
    setTimeout(() => {
      const expiringItems = getExpiringItems();
      const expiredItems = getExpiredItems();
      
      logUI('Item added, checking filters', {
        expiringItemsCount: expiringItems.length,
        expiredItemsCount: expiredItems.length,
        newItemExpiry: item.expiry,
        currentFilter: filterType
      });
      
      // Debug if the new item should appear in the current filter
      const today = new Date();
      const expiryDate = new Date(item.expiry);
      const warningDate = new Date();
      warningDate.setDate(today.getDate() + Config.app.expiryWarningDays);
      
      const isExpiring = expiryDate > today && expiryDate <= warningDate;
      const isExpired = expiryDate < today;
      
      logUI('New item filter status', {
        name: item.name,
        shouldShowInExpiring: isExpiring,
        shouldShowInExpired: isExpired,
        currentFilterIs: filterType,
        wouldBeVisible: 
          (filterType === 'all') || 
          (filterType === 'expiring' && isExpiring) || 
          (filterType === 'expired' && isExpired)
      });
    }, 100);
    
    setShowAddModal(false);
  };
  
  // Handle updating an existing item
  const handleUpdateItem = (item) => {
    updatePantryItem(item);
    setSelectedItem(null);
  };
  
  // Handle deleting an item with confirmation
  const handleDeleteItem = (itemId, itemName) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to remove "${itemName}" from your pantry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removePantryItem(itemId)
        }
      ]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setCategoryFilter(null);
  };
  
  // Render section header
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      {section.icon && (
        <Ionicons name={section.icon} size={18} color={Colors.textSecondary} style={styles.sectionIcon} />
      )}
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>({section.data.length})</Text>
    </View>
  );
  
  // Render list empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="basket-outline" size={64} color={Colors.textTertiary} />
      
      {searchQuery || filterType !== 'all' || categoryFilter ? (
        // Empty state for filtered results
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>No matching items</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search or filters
          </Text>
          <Button 
            title="Reset Filters" 
            onPress={resetFilters}
            icon="refresh"
            type="outline"
            style={styles.resetButton}
          />
        </View>
      ) : (
        // Empty state for empty pantry
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>Your pantry is empty</Text>
          <Text style={styles.emptyText}>
            Add items to your pantry to keep track of what you have
          </Text>
          <Button 
            title="Add First Item" 
            onPress={() => setShowAddModal(true)}
            icon="add"
            style={styles.addFirstButton}
          />
        </View>
      )}
    </View>
  );
  
  // Render filter indicator
  const renderFilterIndicator = () => {
    if (!searchQuery && filterType === 'all' && !categoryFilter) {
      return null;
    }
    
    return (
      <View style={styles.filterIndicator}>
        <View style={styles.activeFilters}>
          {filterType !== 'all' && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>
                {filterType === 'expiring' ? 'Expiring Soon' : 'Expired'}
              </Text>
              <TouchableOpacity
                onPress={() => setFilterType('all')}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          
          {categoryFilter && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>
                {categories.find(c => c.id === categoryFilter)?.name || 'Category'}
              </Text>
              <TouchableOpacity
                onPress={() => setCategoryFilter(null)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          
          {searchQuery && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>
                Search: "{searchQuery}"
              </Text>
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          onPress={resetFilters}
          style={styles.clearFilters}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Text style={styles.clearFiltersText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render Smart Recipe Button
  const renderSmartRecipeButton = () => {
    if (pantryItems.length > 0) {
      return (
        <View style={styles.smartRecipeButtonContainer}>
          <SmartRecipeButton
            onPress={() => navigation.navigate('SmartRecipe')}
          />
        </View>
      );
    }
    return null;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.debugButton}
        onPress={() => {
          logUI('Debug button pressed');
          
          // Log basic filter information
          logFilter('Current filter state', {
            currentFilter: filterType,
            expiringItems: getExpiringItems().length,
            expiredItems: getExpiredItems().length,
            displayedItems: filteredItems.length
          });
          
          Alert.alert(
            'Debug Info', 
            `Filter: ${filterType}\nExpiring: ${getExpiringItems().length}\nExpired: ${getExpiredItems().length}\nDisplayed: ${filteredItems.length}`
          );
        }}
      >
        <Ionicons name="bug-outline" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
      {/* Floating Action Button for adding items */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color={Colors.textLight} />
      </TouchableOpacity>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pantry items..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Smart Recipe Button */}
      {renderSmartRecipeButton()}
      
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === 'all' && styles.activeFilterTab
          ]}
          onPress={() => {
            logUI('All filter tab pressed');
            setFilterType('all');
          }}
        >
          <Text
            style={[
              styles.filterTabText,
              filterType === 'all' && styles.activeFilterTabText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === 'expiring' && styles.activeFilterTab
          ]}
          onPress={() => {
            logUI('Expiring Soon filter tab pressed');
            setFilterType('expiring');
          }}
        >
          <Text
            style={[
              styles.filterTabText,
              filterType === 'expiring' && styles.activeFilterTabText
            ]}
          >
            Expiring Soon
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === 'expired' && styles.activeFilterTab
          ]}
          onPress={() => {
            logUI('Expired filter tab pressed');
            setFilterType('expired');
          }}
        >
          <Text
            style={[
              styles.filterTabText,
              filterType === 'expired' && styles.activeFilterTabText
            ]}
          >
            Expired
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Active Filter Indicators */}
      {renderFilterIndicator()}
      
      {/* Pantry Stats */}
      {!searchQuery && filterType === 'all' && !categoryFilter && (
        <PantryStats
          pantryItems={pantryItems}
          onViewExpiring={() => setFilterType('expiring')}
          onViewExpired={() => setFilterType('expired')}
        />
      )}
      
      {/* Loading Indicator */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your pantry...</Text>
        </View>
      ) : (
        <>
          {/* Item List */}
          {itemsWithCategories.length > 0 ? (
            <SectionList
              sections={groupedItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PantryItemRow
                  item={item}
                  onPress={() => setSelectedItem(item)}
                  onEdit={() => setSelectedItem(item)}
                  onDelete={() => handleDeleteItem(item.id, item.name)}
                  showCategory={filterType !== 'all' || !!searchQuery || !!categoryFilter}
                />
              )}
              renderSectionHeader={renderSectionHeader}
              stickySectionHeadersEnabled={true}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            renderEmptyState()
          )}
        </>
      )}
      
      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Pantry Item</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <PantryItemForm
              onSubmit={handleAddItem}
              onCancel={() => setShowAddModal(false)}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Edit Item Modal */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedItem(null)}
      >
        {selectedItem && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Item</Text>
                <TouchableOpacity
                  onPress={() => setSelectedItem(null)}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Ionicons name="close" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <PantryItemForm
                initialValues={selectedItem}
                onSubmit={handleUpdateItem}
                onCancel={() => setSelectedItem(null)}
              />
            </SafeAreaView>
          </KeyboardAvoidingView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  floatingAddButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.input,
    margin: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginLeft: 6,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  smartRecipeButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: Colors.input,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeFilterTabText: {
    color: Colors.textLight,
  },
  filterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray200,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  clearFilters: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyContent: {
    alignItems: 'center',
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    minWidth: 150,
  },
  resetButton: {
    minWidth: 150,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default PantryScreen;
