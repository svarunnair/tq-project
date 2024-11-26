// import React, { useState } from 'react';
// import { View, StyleSheet, Platform } from 'react-native';
// // import { Dropdown } from 'react-native-element-dropdown';

// const MyDropdown = (props) => {
//   const [value, setValue] = useState(null);

//   const data = props.data;

//   return (
//     <View style={styles.container}>
//       <View style={styles.dropdownWrapper}>
//         <Dropdown
//           style={styles.dropdown}
//           data={data}
//           labelField="name"
//           valueField="id"
//           placeholder="Select event"
//           value={value}
//           onChange={item => {
//             setValue(item.id);
//             console.log('Selected item:', item);
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   dropdownWrapper: {
//     zIndex: Platform.OS === 'android' ? 1 : 0,  // Apply zIndex if on Android
//   },
//   dropdown: {
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//   },
// });

// export default MyDropdown;
