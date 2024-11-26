import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, FlatList, ImageBackground } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HEIGHT, WIDTH } from '../common/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { gstyles } from '../common/GlobalStyles';
import alocate from '../../assets/images/alocate.png';
import emptyTable from '../../assets/images/noTable.png';
import circleFree from '../../assets/images/Table/cirFree.png'
import ppl from '../../assets/images/pplIcon.png'
import cirOcc from '../../assets/images/Table/cirOcc.png'
import cirRes from '../../assets/images/Table/cirRes.png'
import cirSd from '../../assets/images/Table/cirSd.png'
import recRes from '../../assets/images/Table/recResr.png'
import RecSd from '../../assets/images/Table/RecSdr.png'
import rectFree from '../../assets/images/Table/rectFreer.png'
import rectOcc from '../../assets/images/Table/rectOccr.png'
import squareFree from '../../assets/images/Table/sq.png'
import squareOcc from '../../assets/images/Table/squareOcc.png'
import squareRes from '../../assets/images/Table/squareRes.png'
import squareSd from '../../assets/images/Table/squareSd.png'
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const TableSelectionModal = React.forwardRef((props, ref) => {

    const sectionData = props.sectionData
    const tableData = props.tableData
    const [currentSection, setCurrentSection] = useState(null);
    const tableList= props.tableList
    const [modalVisible,setModalVisible] = useState(false)
    const modifiedData = [];
    const [selectedTables, setSelectedTables] = useState([]);
    const [details, setDetails] = useState([])
    const {onTableSelect} = props
    const {onTabelDetails} = props
    const navigation = useNavigation()
    const avalilabelTables = props.avalilabelTables
    const {deseleTable} = props

    const convertTimestampToFormattedDate = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      const formattedTime = `${hours}:${minutes} ${ampm}`;
      return `${year}-${month}-${day} ${formattedTime}`;
    };



    useEffect(() => {
      if (deseleTable) {
          setSelectedTables((prevSelected) => 
              prevSelected.filter(id => id !== deseleTable)
          );
          // Optionally update details if necessary
          setDetails((prevDetails) => 
              prevDetails.filter(detail => detail._id !== deseleTable)
          );
      }
  }, [deseleTable]);

    useEffect(()=>{
      onTableSelect(selectedTables)
      onTabelDetails(details)
    },[details])


for (const floor_id in tableList) {
  if (tableList.hasOwnProperty(floor_id)) {
    const tables = tableList[floor_id];
    tables.forEach(table => {
      modifiedData.push({ ...table, floor_id });
    });
  }
}

const handleCancel=()=>{
    // setSelectedTables([])
    // setDetails([])
    ref.current.close()
}

const filteredDataNew = modifiedData.filter(table => 
    table.table_status !== "occupied" && table.table_status !== "reserved" && table._id !== avalilabelTables
  );


  const handleConfirm =()=>{
    onTableSelect(selectedTables)
    onTabelDetails(details)
    ref.current.close()
    
  }

  const matchingSection = sectionData?.find(section => section.name === currentSection);
  const sectionName = matchingSection ? matchingSection._id : "Section not found";

    useEffect(() => {
        if (sectionData?.length > 0) {
          setCurrentSection(sectionData[0]?.name);
        }
      }, [sectionData]);

  const filteredData = filteredDataNew?.filter(item => item.floor_id === sectionName)

  const handleEventSelect = (name) => {
    setCurrentSection(name);
    setModalVisible(false);
  };

  const handleTable = (item) => {
    if (selectedTables.includes(item._id)) {
      setSelectedTables(selectedTables.filter(id => id !== item._id));
      setDetails(details.filter(detail => detail._id !== item._id));
    } else {
      setSelectedTables([...selectedTables, item._id]);
      setDetails([...details, item]);
    }
  }


  useFocusEffect(
    useCallback(() => {
      if (tableData && tableData[0]?.floor_id?.name) {
        setCurrentSection(tableData[0].floor_id.name);
      }
    }, [tableData])
  );  


    return (
        <RBSheet
            ref={ref}
            animationType="slide"
            height={HEIGHT * 0.7}
            openDuration={250}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
                wrapper: {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                },
                container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: 15,
                    paddingBottom: 10, 
                },
                draggableIcon: {
                    backgroundColor: "#000",
                },
            }}
            snapPoints={[HEIGHT * 0.5, HEIGHT * 0.6, HEIGHT * 0.8]}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Tables</Text>
                    <AntDesign name='close' size={24} color='#2E86C1' onPress={() => ref.current.close()} />
                </View>
                <View>
        <TouchableOpacity style={styles.inputContainer} onPress={() => setModalVisible(true)}>
          <View style={[styles.pickerContainer, { flexDirection: 'row' }]}>
            <Text style={{ color: "grey", left: 15, maxWidth: WIDTH * 0.78 }}>{currentSection}</Text>
            {modalVisible ? <AntDesign name='caretup' size={15} color='black' style={{ right: 15 }} />
              : <AntDesign name='caretdown' size={15} color='black' style={{ right: 15 }} />}
          </View>
        </TouchableOpacity>
      </View>

                <ScrollView style={styles.scrollView}>

                    <View style={styles.section}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <FlatList
              data={sectionData}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleEventSelect(item?.name)}>
                  <Text style={styles.modalText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.name}
            />
          </View>
        </View>
      </Modal>    
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.optionContainer}>
                            {filteredData.length<1&&<View style={{display:"flex",gap:20,justifyContent:"center",alignItems:"center"}}>
      <Image style={styles.img} source={emptyTable}/>
      <Text style={{color:"#5DADE2",fontWeight:"bold"}}>No table is availabel !</Text>
      </View>}

      <View style={styles.tableMap}>

        {filteredData?.map((item)=>(
          <TouchableOpacity onPress={()=>handleTable(item)} style={styles.insideBox}>

           {item.table_shape.name === "circle" && item.table_status === "free"&& (
        <ImageBackground style={styles.imageMap}  source={selectedTables.includes(item._id) ? cirOcc : circleFree}>
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
      )}

{item.table_shape.name === "circle" && item.table_status === "scheduled"&& (
   <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <ImageBackground style={styles.imageMap}  source={selectedTables.includes(item._id) ? cirOcc : cirSd}>
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
        {item?.reservations?.map((item)=>(
          <View>
            <Text style={{color:"black",fontSize:11}}>{convertTimestampToFormattedDate(item.reservation_time)}</Text>
          </View>
        ))}
       </View>
      )}

      {item.table_shape.name === "square" && item.table_status === "free"&& (
        <ImageBackground style={styles.imageMapSq} source={selectedTables.includes(item._id) ? squareOcc : squareFree}>
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
      )}
     
   {item.table_shape.name === "square" && item.table_status === "scheduled"&& (
     <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <ImageBackground style={styles.imageMapSq} source={selectedTables.includes(item._id) ? squareOcc : squareSd}>
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
        {item?.reservations?.map((item)=>(
          <View>
            <Text style={{color:"black",fontSize:11}}>{convertTimestampToFormattedDate(item.reservation_time)}</Text>
          </View>
        ))}
        </View>
      )}


      {item.table_shape.name === "rectangle" && item.table_status === "free"&&  (
        <ImageBackground style={styles.imageMapRec} source={selectedTables.includes(item._id) ? rectOcc : rectFree}>
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
      )}  
      
      {item.table_shape.name === "rectangle" && item.table_status === "scheduled"&&  (
      <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <ImageBackground style={styles.imageMapRec} source={selectedTables.includes(item._id) ? rectOcc : RecSd}>
          <Text style={styles.tableName}>{item.name}</Text>
          <View style={styles.capacityContainer}>
            <Image style={styles.capacityIcon} source={ppl} />
            <Text style={styles.tableName}>{item.capacity}</Text>
          </View>
        </ImageBackground>
        {item?.reservations?.map((item)=>(
          <View>
            <Text style={{color:"black",fontSize:11}}>{convertTimestampToFormattedDate(item.reservation_time)}</Text>
          </View>
        ))}
        
        </View>
      )}  
     
          </TouchableOpacity>
        ))}

      </View> 
                        </View>
                        
                    </View>
                    
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}> 
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
            </View>
        </RBSheet>
    );
});

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
        alignItems:"center"
      },
      imageMapSq:{
        width:70,
        height:80,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      },
      img:{
        width:200,
        height:200
      }
});

export default TableSelectionModal;

