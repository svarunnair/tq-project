import React, { forwardRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, ScrollView } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import {cirOcc} from '../../assets/images/Tables/cirOcc.png'
// import {recOcc} from '../../assets/images/Tables/recOcc.png'
// import {sqrOcc} from '../../assets/images/Tables/sqrOcc.png'
// import {ppl} from '../../assets/images/Tables/pplIcon.png'
import { HEIGHT, WIDTH } from '../common/Constants';
import LinearGradient from 'react-native-linear-gradient';
import { gstyles } from '../common/GlobalStyles';

const cirOcc = require('../../assets/images/Tables/cir2.png');
const recOcc = require('../../assets/images/Tables/recfree.png');
const sqrOcc = require('../../assets/images/Tables/sqrfree.png');

const cirOccSel = require('../../assets/images/Tables/cirfree2.png');
const recOccSel = require('../../assets/images/Tables/recOccRot.png');
const sqrOccSel = require('../../assets/images/Tables/sqrOcc.png');


const ppl = require('../../assets/images/Tables/pplIcon.png');


const TableRelSelModal = forwardRef((props, ref) => {

    const filteredData = props.filteredData
    const [selectedTables, setSelectedTables] = useState([]);
    const [details,setDetails] = useState([])
    const {onSelectedTableName} = props
    const clearTable = props.clearTable
    const clearRespo = props.clearRespo
    const getTabelOccupied = props.getTabelOccupied
    // const clear = props.clear


    


    useEffect(()=>{
      if(clearRespo){
        setSelectedTables([])
      }
    },[clearRespo])


    useEffect(()=>{
      onSelectedTableName(selectedTables)
    },[selectedTables])


    const handleConfirm =()=>{
      ref.current.close();
    }

    const handleCancel =()=>{
      setSelectedTables([])
      ref.current.close();
    }




    const transformedData = Object.values(filteredData).flatMap(item => {
        const [floorId, objects] = Object.entries(item)[0];
        return objects.map(obj => ({
          ...obj,
          floor_id: floorId
        }));
      });


      console.log('=-------------transformedData-=========----------------------',transformedData)


      // const occupiedTable = transformedData?.filter((item)=>item.table_status==="free")


    

      
        const handleTable = (item) => {
            if (selectedTables.includes(item.name)) {
              setSelectedTables(selectedTables.filter(id => id !== item.name));
              // setDetails(details.filter(detail => detail.name !== item.name));
            } else {
              setSelectedTables([...selectedTables, item.name]);
              // setDetails([...details, item]);
            }
          }
      


  const handleClose = () => {
    ref.current.close();
  };

  return (
    <RBSheet
      ref={ref}
      height={450}
      openDuration={250}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 20,
          paddingHorizontal: 16,
        }
      }}
    >
      <View style={{ paddingVertical: 10, alignItems: 'center', position: 'relative' }}>
        <Text style={{ color: "#7c9eca", fontWeight: "bold", fontSize: 23 }}>Tables</Text>

        <TouchableOpacity 
          onPress={handleClose}
          style={{
            position: 'absolute',
            right: 0,
            top: -5,
            padding: 10
          }}
        >
          <AntDesign name="close" size={24} color="#7c9eca" />
        </TouchableOpacity>
      </View>

     <ScrollView contentContainerStyle={styles.scrollViewContainer}>
  {transformedData?.map((item) => (
    <TouchableOpacity onPress={() => handleTable(item)} style={styles.insideBox} key={item.name}>     
      {item.table_shape.name === "circle"  && (
        <ImageBackground style={styles.imageMapSq} source={selectedTables.includes(item.name) ? cirOccSel : cirOcc} >
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
      )}

      {item.table_shape.name === "square"  && (
        <ImageBackground style={styles.imageMapSq} source={selectedTables.includes(item.name) ? sqrOccSel : sqrOcc}>
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
      )}
     
      {item.table_shape.name === "rectangle"  && (
        <ImageBackground style={styles.imageMapRec} source={selectedTables.includes(item.name) ? recOccSel : recOcc}>
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
      )}  
    </TouchableOpacity>
  ))}
</ScrollView>


<View style={styles.buttonContainer}>
                    <TouchableOpacity
                    onPress={handleCancel}
                     style={styles.cancelButton}>
                        <Text style={{ color: "blue" }}>Cancel</Text>
                    </TouchableOpacity>
 
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#8338EC', '#3A86FF']}
                        style={styles.gradientTouch}
                    >
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.btnTouch}
                            onPress={handleConfirm}
                            
                        >
                            <Text style={gstyles.OpenSans_SemiBold(14, '#FFFFFF')}>
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

    </RBSheet>
  );
});

export default TableRelSelModal;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop:20
    },
    headerText: {
        color: "#2E86C1",
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        display: "flex",
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
    },
    optionButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    optionText: {
        color: "black",
    },
    buttonContainer: {
        display:"flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        padding: 10,
        gap:10
    },
    cancelButton: {
        backgroundColor: "white",
        borderWidth: 0.4,
        borderColor: "blue",
        padding: 10,
        borderRadius: 4,
        width: WIDTH * 0.45,
        justifyContent: "center",
        alignItems: "center",
    },
    gradientTouch: {
        width: WIDTH * 0.45,
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnTouch: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    section:{
        display:"flex",
        flexDirection:"row",
        gap:5
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalView: {
        width: WIDTH * 0.90,
        backgroundColor: '#FFFFFF',
        shadowColor: '#00000066',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderRadius: 4,
        padding: 20
      },
      modalText: {
        padding: 10,
        fontSize: 18,
        color: 'black',
        borderBottomColor: '#ccc'
      },
      pickerContainer: {
        borderColor: "#3A86FF20",
        borderRadius: 5,
        borderBottomWidth: 2,
        borderWidth: 0.5,
        width: WIDTH * 0.91,
        height: HEIGHT * 0.06,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0F6FF30',
        marginTop: 3
      },
      tableMap:{
        display:"flex",
        flexDirection:"row",
        gap:50,
        flexWrap:"wrap",
        justifyContent:"center"
      },
      insideBox:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
       
        
      },
      imageMap:{
        width:70,
        height:70,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      },
      tableName:{
        color:"black",
      },
      capacityIcon:{
        width:20,
        height:20
      },
      capacityContainer:{
        display:"flex",
        flexDirection:"row",
        gap:3
      },
      imageMapRec:{
         width:70,
        height:120,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        // borderWidth:.3,
        borderColor:"red"
      },
      imageMapSq:{
        width:70,
        height:80,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        // borderWidth:.3
      },
      img:{
        width:200,
        height:200
      },
      scrollViewContainer:{
        display:"flex",
        flexWrap:"wrap",
        flexDirection:"row",
        gap:35,
        justifyContent:"center",
        paddingTop:20,
      },
      settleBtnTouch: {
        width: '49%',
        height: 42,
        borderRadius: 4,
        ...gstyles.centerXY
    },
    btnTouch: {
        width: '50%',
        height: 42,
        ...gstyles.centerXY,
        borderRadius: 4
    },
    buttonContainer: {
        display:"flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        padding: 10,
        gap:10
    },
    cancelButton: {
        backgroundColor: "white",
        borderWidth: 0.4,
        borderColor: "blue",
        padding: 10,
        borderRadius: 4,
        width: WIDTH * 0.45,
        justifyContent: "center",
        alignItems: "center",
    },
});



