const initialState = {
    sTransactions: [],
    usTransactions: [],
    totalAmount: 0,
    saffsList: [],
    // selectedFilter: 'all',
    selectedFilter: [],
    filteredStaffsList: [],
    validationsTrasactions: [],
    eventDetails: [],
    totalvalidationsEntries: 0,
    vendor: [],
    latestId: '',
    freeDrinks:[],
    freeDrinkTransactions:[],
    menuItems:[],
    menuItemsCount:0
    
}
const transactionsreducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_S_TRANSACTIONS':
        return {...state, sTransactions: action.payload.sTransactions};
        break;
      case 'UPDATE_US_TRANSACTIONS':
        return {...state, usTransactions: action.payload.usTransactions};
        break;
      case 'UPDATE_TOTAL_AMOUNT':
        return {...state, totalAmount: action.payload.totalAmount};
        break;
        // 
        case 'UPDATE_MENU_COUNT':
          return {...state, menuItemsCount: action.payload.menuItemsCount};
          break;
          // 
      case 'UPDATE_STFFS_LIST':
        return {...state, saffsList: action.payload.saffsList};
        break;
      case 'UPDATE_SELECTED_FILTER':
        return {...state, selectedFilter: action.payload.selectedFilter};
        break;
      case 'UPDATE_FILTERED_STAFF':
        return {
          ...state,
          filteredStaffsList: action.payload.filteredStaffsList,
        };
        break;
      case 'UPDATE_VALIDATED_TRANSACTIONS':
        return {
          ...state,
          validationsTrasactions: action.payload.validationsTrasactions,
        };
        break;
      case 'UPDATE_TOTAL_ENTRIES':
        return {
          ...state,
          totalvalidationsEntries: action.payload.totalvalidationsEntries,
        };
        break;
      case 'UPDATE_EVENT_DETAILS':
        return {...state, eventDetails: action.payload.eventDetails};
        break;
      case 'UPDATE_VENDOR_DETAILS':
        return {...state, vendor: action.payload.vendor};
        break;
      case 'UPDATE_LATEST_ID':
        return {...state, latestId: action.payload.latestId};
        break;
      case 'UPDATE_FREE_DRINKS':
        return {...state, freeDrinks: action.payload.freeDrinks};
        break;
      case 'UPDATE_FREE_DRINK_TRANSACTIONS':
        return {
          ...state,
          freeDrinkTransactions: action.payload.freeDrinkTransactions,
        };
        break;
      case 'UPDATE_MENU_ITEMS':
        return {
          ...state,
          menuItems: action.payload.menuItems,
        };
        break;
        
      default:
        return state;
    }
}
export default transactionsreducer;