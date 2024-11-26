// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';

// const WIDTH = Dimensions.get('window').width;

// const DropdownComponent = (props) => {
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   // Data passed to the dropdown (example from props.selectedFilter)
//   const events = props.data || [];

//   console.log('..events.......', events); // Check the data passed to the dropdown

//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.label}>Select an Event:</Text> */}

//       <Dropdown
//         style={styles.dropdown}
//         data={events?.map((event) => ({
//           label: event.name, 
//           value: event.id
//         }))}
//         labelField="label"
//         valueField="value"
//         placeholder="Select an event"
//         value={selectedEvent}
//         onChange={(item) => setSelectedEvent(item.value)}
//         maxHeight={200}
//         placeholderStyle={styles.placeholderStyle} // Make sure the placeholder is visible
//         selectedTextStyle={styles.selectedTextStyle} // Style for selected item text
//       />

//       {selectedEvent && <Text style={styles.selectedText}>Selected Event ID: {selectedEvent}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//     backgroundColor: '#fff',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   dropdown: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     marginBottom: 16,
//     backgroundColor: '#fff',  // Ensure a background color so it's visible
//   },
//   placeholderStyle: {
//     color: '#888', // Set placeholder text color
//   },
//   selectedTextStyle: {
//     color: '#000', // Set selected item text color
//   },
//   selectedText: {
//     marginTop: 16,
//     fontSize: 14,
//     color: '#333',
//   },
// });

// export default DropdownComponent;
