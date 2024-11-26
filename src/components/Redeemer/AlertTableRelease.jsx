import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { gstyles } from '../common/GlobalStyles';
import {alert} from '../../assets/images/redAl.png'

console.log('.................alert..........',alert)

const AlertTableRelease = (props) => {
    const {onCheckChange,onConfirm} = props
    const onClickTableRele = props.onClickTableRele
    const onClickRedeem = props.onClickRedeem
    const {onModalChange} = props
    const tableName = props.tableName
    const sectionName = props.sectionName
    


    const handleConFirm =()=>{
        onClickTableRele()
        onClickRedeem()
        onConfirm()
    }
  return (
    <Modal
      visible={true}
      transparent={true} // To ensure the modal overlays the entire screen
      animationType="fade" // Optional: You can use animation like "fade" or "slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>

          {/* Close Button */}
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={()=>onModalChange()}>
              <AntDesign name='close' size={25} color='#0276E5' />
            </TouchableOpacity>
          </View>

          
          <View style={{display: "flex",padding:10}}>
  <Image style={{width: 75, height: 75}} source={require('../../assets/images/redAl.png')} />
</View>

          {/* Alert Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.alertTitle}>Alert</Text>
          </View>

          {/* Alert Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.alertDescription}>
              Are you sure you want to release the following table? It will be free for other guests.
            </Text>
          </View>

          {/* Table and Section Information */}
          <View style={styles.infoContainer}>
            

              {tableName?.map((item)=>(
                <View style={styles.infoBox}>
                <Text style={styles.infoText}>{item}</Text>
                </View>
              ))}
             


             {sectionName?.map((item)=>(
                <View style={styles.infoBox}>
                <Text style={styles.infoText}>{item}</Text>
              </View>
              ))}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity activeOpacity={0.6}
                            style={ styles.btnTouch}
                            onPress={handleConFirm}
                          
                        >
          <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={ ['#8338EC', '#3A86FF'] }
                        style={styles.settleBtnTouch}>
                      
                            <Text style={{color:"white"}}>
                                Confirm
                            </Text>
                
                    </LinearGradient>
                    </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)' // Dark background for modal transparency
  },
  modalContainer: {
    width: '80%', // Adjust modal width
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonContainer: {
    alignSelf: 'flex-end', // Align close button to the top-right
  },
  titleContainer: {
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  alertDescription: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center', // Center the text inside the description
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    flexWrap:"wrap"
  },
  infoBox: {
    backgroundColor: '#c3dcf3',
    padding: 3,
    paddingHorizontal:8,
    borderRadius: 3,
    borderColor:"#1773ca",
    borderWidth:1
  },
  infoText: {
    color: 'black',
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#0276E5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settleBtnTouch: {
    width: '49%',
    height: 42,
    borderRadius: 4,
    ...gstyles.centerXY
},
btnTouch: {
    width: '100%',
    height: 42,
    ...gstyles.centerXY,
    borderRadius: 4
},
};

export default AlertTableRelease;
