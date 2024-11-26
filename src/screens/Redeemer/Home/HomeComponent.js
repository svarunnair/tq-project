import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StatusBar,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    RefreshControl,
    Platform,
    Modal,
   
    TouchableWithoutFeedback,
    Animated
} from 'react-native';
import { gstyles } from '../../../components/common/GlobalStyles';
import { HEIGHT, OpenSans_Medium, WIDTH, app_Bg } from '../../../components/common/Constants';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RedeemedDetailsModal from '../../../components/Redeemer/RedeemedDetailsModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LoadingModel from "../../../components/common/Loading"
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import DropdownComponent from '../../../components/Redeemer/DropDownComponent';

 
const HomeComponent = (props) => {
 
    // const [selectedFilter, setSelectedFilter] = useState('By Bill');
    const platform = Platform.OS =='ios';
    const [role, setRole] = useState(null)
    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null)
    const [eventId, setEventId] = useState(null)
    const getEvents = props.getEvents
    const {onData} = props
    const [dropdownVisible, setDropdownVisible] = useState(false);
 
    console.log('.............selectedItem...******.........',props?.selectedFilter)
 
    // console.log("-------------props?.selectedFilter-----------------",props?.selectedFilter)

    const dropdownHeight = useRef(new Animated.Value(0)).current;


    // const heightDrop = props?.selectedFilter.length



    // useEffect(() => {
    //     Animated.timing(dropdownHeight, {
    //       toValue: dropdownVisible ? Math.min(150, 200) : 0,
    //       duration: 250,
    //       useNativeDriver: false,
    //     }).start();
    //   }, [dropdownVisible]);




    useEffect(() => {
        if (dropdownVisible) {
          Animated.timing(dropdownHeight, {
            toValue: props?.selectedFilter?.length<4?100:150,  
            duration: 250,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(dropdownHeight, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }).start();
        }
      }, [dropdownVisible]);
 
 
 
    const totalRedeeemdAmount = props?.selectedFilter.length>1? props.totalRedeemedAmount:0
    const menuItems = props?.selectedFilter.length>1?props.totalMenuItemsCount:0
    const settledData = props.settledData||[]
    const unsettledData = props. unSettledData||[]
    const {onBtn} = props
    const {onParam} = props
   
    useEffect(()=>{
        onData(eventId)
        onParam(eventId)
    },[selectedItem])
 
 
    useEffect(()=>{
        setSelectedItem(props?.selectedFilter[0]?.name)
        setEventId(props?.selectedFilter[0]?.id)
    },[props?.selectedFilter])
 
   
    useFocusEffect(
        React.useCallback(() => {
            setDropdownVisible(false)
            setSelectedItem(props?.selectedFilter[0]?.name)
            setEventId(props?.selectedFilter[0]?.id)
            onBtn('unsettled')
        }, [props?.selectedFilter])
    );
 
      useEffect(() => {
        const roledata = async () => {
          try {
            const roleCheck = await AsyncStorage.getItem('role');
            if (roleCheck !== null) {
              setRole(roleCheck);  
            }  
          } catch (err) {
            console.log('error...', err);
          }
        };
        roledata();
       
      }, []);
 
    const getFilteredTransactions = () => {
        const { usTransactions, sTransactions, isBtnSelected } = props;
 
        const transactions = isBtnSelected == 'settled' ? settledData : unsettledData;
 
        return transactions;
    };
 
    const dataView = props?.selectedFilter.length>1? getFilteredTransactions():[]
 
    const renderItem = ({ item }) => (
        item.name !== undefined ? (
            
          <TouchableOpacity
            style={styles.dropdownItem}
            activeOpacity={0.6}
            onPress={() => {
              setModal(false);
              setDropdownVisible(false);
              setSelectedItem(item.name);
              setEventId(item.id);
            }}
          >
            <Text style={[
              gstyles.OpenSans_SemiBold(14, props.selectedEvent === item.name ? '#0276E5' : '#000'),
              { opacity: props.selectedEventId === item.id ? 0.5 : 1 }
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ) : null
      );
   
    const filters = ['By Bill', 'Drinks', 'Menu Items'];
    const bill = ['By Bill'];
    const menuData =role==="Redeemer"?bill:filters
    const widthRole = menuItems===0?"100%":"50%"
 
   
    const renderRecentTrans = ({item,index}) => {
        // console.log('--------item.action_data-----------',item.action_data);
        const parsedActionData = JSON.parse(item.action_data);
 
        console.log('=-----------parsedActionData------------',parsedActionData);
        return (
         <TouchableOpacity onPress={() => { props.setIsDetailModal({visible:!props.isDetailModal.visible,data:item}) }}
                style={styles.transCardView}>
 
 
 
                   
 
{item.bill_number && <View style={{display:"flex",padding:10,flexDirection:"row",justifyContent:"space-between" }}>
                {item.bill_number && <View style={gstyles.inRow}>
                        <Text style={gstyles.OpenSans_Regular(12, '#000000', gstyles.size(75))}>
                            Bill No.
                        </Text>
                        <Text style={gstyles.OpenSans_Bold(14, '#000000')}>
                            :   {item.bill_number}
                        </Text>
                    </View>  }
 
 
{ !parsedActionData.totalItemsQuantity&&item.bill_number &&<Text style={[gstyles.OpenSans_Bold(24, '#000000'),{paddingRight:10}]}>
                        {'\u20B9'} {Number(item.value).toFixed(0)}
                    </Text>}
 
 
 
                </View>}
           
                {!item.bill_number &&<View style={[gstyles.inRowJSB, gstyles.mt(6), gstyles.mx(12)]}>
 
 
                   
                    <View style={gstyles.inRow}>
                        <Text style={gstyles.OpenSans_Regular(12, '#000000', gstyles.size(75))}>
                            Coupon ID
                        </Text>
                        <Text style={gstyles.OpenSans_Bold(14, '#000000')}>
                            :  {item.ticket_tracking_id}
                        </Text>
                    </View>
 
                   
                    {/* <Text style={gstyles.OpenSans_Regular(10, '#000000')}>
                        {moment(item.createdAt).format("DD MMM YY | hh:mm A")}
                    </Text> */}
 
<View style={{display:"flex",borderColor:"black",width:WIDTH*.3,}}>
 
   
                <View style={[gstyles.inRowJSB, gstyles.mt(10), gstyles.mx(12)]}>
                   
                   <Text style={gstyles.OpenSans_Bold(24, '#000000')}>
                    </Text>
 
                    { !parsedActionData.totalItemsQuantity&&!item.bill_number &&<Text style={[gstyles.OpenSans_Bold(24, '#000000'),{}]}>
                        {'\u20B9'} {Number(item.value).toFixed(0)}
                    </Text>}
 
                  { parsedActionData.totalItemsQuantity&& <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',gap:10 }}>
                   
                   <Text style={gstyles.OpenSans_Bold(24, '#000000')}>
                          {parsedActionData.totalItemsQuantity}
                           </Text>
                           <Text style={{color:"black", fontWeight:"bold"}}>Drinks</Text>
                            </View>}
 
                            {item.bill_number&&<Text style={gstyles.OpenSans_Regular(10, '#000000')}>
                        {moment(item.createdAt).format("DD MMM YY | hh:mm A")}
                    </Text> }
   
 
                           
                </View>
                </View>
                </View>}
 
                {item.bill_number &&<View style={[gstyles.inRowJSB, gstyles.mt(-12), gstyles.mx(12)]}>
 
 
                   
<View style={gstyles.inRow}>
    <Text style={gstyles.OpenSans_Regular(12, '#000000', gstyles.size(75))}>
        Coupon ID
    </Text>
    <Text style={gstyles.OpenSans_Bold(14, '#000000')}>
        :  {item.ticket_tracking_id}
    </Text>
</View>
 
 
{/* <Text style={gstyles.OpenSans_Regular(10, '#000000')}>
    {moment(item.createdAt).format("DD MMM YY | hh:mm A")}
</Text> */}
 
<View style={{display:"flex",borderColor:"black",width:WIDTH*.3,}}>
 
 
<View style={[gstyles.inRowJSB, gstyles.mt(10), gstyles.mx(12)]}>
 
<Text style={gstyles.OpenSans_Bold(24, '#000000')}>
</Text>
 
{ !parsedActionData.totalItemsQuantity&&!item.bill_number &&<Text style={[gstyles.OpenSans_Bold(24, '#000000'),{}]}>
    {'\u20B9'} {Number(item.value).toFixed(0)}
</Text>}
 
{ parsedActionData.totalItemsQuantity&& <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',gap:10 }}>
 
<Text style={gstyles.OpenSans_Bold(24, '#000000')}>
      {parsedActionData.totalItemsQuantity}
       </Text>
       <Text style={{color:"black", fontWeight:"bold"}}>Drinks</Text>
        </View>}
 
        {/* {item.bill_number&&<Text style={gstyles.OpenSans_Regular(10, '#000000')}>
    {moment(item.createdAt).format("DD MMM YY | hh:mm A")}
</Text> } */}
 
{item.bill_number&&<Text style={{color:"#4b4b4b",fontSize:10,width:100,textAlign:"right",fontWeight:"400"}}>
    {moment(item.createdAt).format("DD MMM YY | hh:mm A")}
</Text> }
 
 
       
</View>
</View>
</View>}
 
               
   
 
 
                <View style={[gstyles.inRowJSB, gstyles.mt(8), gstyles.mx(12), gstyles.mb(item.excess_amount!=0 ? 4 : 10)]}>
                   
                    {item.table_number ? <View style={gstyles.inRow}>
                        <Text style={gstyles.OpenSans_Regular(12, '#000000', gstyles.size(75))}>
                            Table No.
                        </Text>
                        <Text style={gstyles.OpenSans_SemiBold(12, '#000000', gstyles.size(120))}
                            numberOfLines={1}
                        >
                            :   {item.table_number}
                        </Text>
                    </View> : <View style={gstyles.inRow}>
                        <Text style={gstyles.OpenSans_Regular(12, '#000000', gstyles.size(75))}>
                            Name
                        </Text>
                        <Text style={gstyles.OpenSans_SemiBold(12, '#000000', gstyles.size(120))}
                            numberOfLines={1}
                        >
                            :   {item.customer_name}
                        </Text>
                    </View>}
 
 
                    {/*  */}
                
 
{!item.bill_number&&<Text style={{color:"#4b4b4b",fontSize:10,width:100,textAlign:"right",fontWeight:"400"}}>
    {moment(item.createdAt).format("DD MMM YY | hh:mm A")}
</Text> }
 
 
 
 
 
                  { item.bill_number&& <Text style={[
    gstyles.OpenSans_Regular(10, '#000000'),
    { width: WIDTH*.32,textAlign:"right",paddingRight:12}
  ]}
    numberOfLines={1}
>
    Redeemed by {item.redeemer.name}
</Text>}
  
 
                </View>
                {(item.excess_amount && item.excess_amount!=0) ?
                <View style={[gstyles.inRowJSB, gstyles.mt(6), gstyles.mx(12),gstyles.mb(item.items && JSON.parse(item.items).length>0 ? 4 : 10)]}>
                    <View style={gstyles.inRow}>
                        <Text style={gstyles.OpenSans_Regular(12, '#000000', gstyles.size(75))}>
                            Excess Paid
                        </Text>
                        <Text style={gstyles.OpenSans_Bold(14, '#000000')}>
                            :  Rs.{Math.round(item.excess_amount)} | by {item.ea_payment_mode}
                        </Text>
                    </View>
                </View> : null}
                {item.items && JSON.parse(item.items).length>0 &&
                <View style={[gstyles.inRowJSB, gstyles.mt(6), gstyles.mx(12),gstyles.mb(10)]}>
                    <View style={gstyles.inRow}>
                        <Text style={gstyles.OpenSans_Regular(12, '#000000', gstyles.size(75))}>
                            Drinks
                        </Text>
 
                       
                        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
 
                            <Text style={{color:"black"}}>:   </Text>
 
                            <View style={{display:"flex",flexDirection:"row",}}>
 
                            <Text numberOfLines={2} style={[gstyles.OpenSans_SemiBold(14, '#000000'),{width:WIDTH*.3,}]}>
                         {JSON.parse(item.items).length>0 ? JSON.parse(item.items).map((item) => {return item.name+"("+item.quantity+")";}).join(", ") : ""}
 
                         
                        </Text>
 
 
                        {props.userData ?
 
                    <View style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <Text style={[
                        gstyles.OpenSans_Regular(10, '#000000'),
                        { width: WIDTH*.32,textAlign:"right",paddingRight:10}
                      ]}
                        numberOfLines={1}
                    >
                        Redeemed by {item.redeemer.name}
                    </Text></View> : null }
 
                            </View>
                       
 
                       
 
                        </View>
                    </View>
                </View> }
 
            </TouchableOpacity>
        );
    }
 
    const _renderNoTrans = () => {
        return (
            <View style={[gstyles.centerXY, { marginTop:'25%' }]}>
                <Image source={require('../../../assets/images/no_trans.png')}
                    style={[gstyles.iconSize(WIDTH / 1.8), { opacity: 0.7 }]}
                />
                <Text style={[gstyles.OpenSans_SemiBold(20, '#0276E5'), { opacity: 0.7 }]}>
                    No Transactions Found
                </Text>
            </View>
        );
    }
 
 
    const arrayLength = props?.isBtnSelected == 'settled' ? props?.sTransactions?.length : props?.usTransactions?.length
 
    return (
        
        <>
            <StatusBar
                backgroundColor={app_Bg}
                animated={true}
                barStyle="dark-content"
            />
            <View style={[gstyles.container(app_Bg)]}>
                <View style={[styles.header, (platform ? { paddingTop: HEIGHT*0.04 } : null )]}>
                    <View style={[gstyles.inRow, { alignItems: 'center' }]}>
                        <Image source={require('../../../assets/images/login_logo.png')}
                            style={{ width: 34, height: 27 }}
                        />
                        <Text style={gstyles.OpenSans_SemiBold(18, '#000000', { ...gstyles.ms(10), width: '75%' })}
                            numberOfLines={1}
                        >
                            Welcome {props.nodeUserData && props.nodeUserData.partner.name}
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.6}
                        onPress={() => { props.onClickSearchIcon() }}
                    >
                        <Ionicons name='ios-search-outline' size={22} color='#3F3F3F' />
                    </TouchableOpacity>
                </View>
 
{/* */}
 
       {/* { props?.selectedFilter.length!==2&& <TouchableOpacity
         disabled={props?.selectedFilter.length===1||props?.selectedFilter.length===2}
          style={styles.inputContainer} onPress={() => setModal(true)}>
                        <View style={[styles.pickerContainer, { flexDirection: 'row' }]}>
                            <Text style={[gstyles.OpenSans_Bold(16, '#000000'), { left: 15, maxWidth: WIDTH * 0.78 }]}>{selectedItem}</Text>
                            {modal && <AntDesign name='caretup' size={15} color='black' style={{ right: 15 }} />}
                                {!modal&&props?.selectedFilter.length>2 &&<AntDesign name='caretdown' size={15} color='black' style={{ right: 15 }} />}
                        </View>
                    </TouchableOpacity>} */}



                
{/* 
                    { props?.selectedFilter.length!==2&&
                     <TouchableOpacity
                     disabled={props?.selectedFilter.length===1||props?.selectedFilter.length===2}
                     style={styles.inputContainer} 
                     onPress={() => setModal(true)}>
                        <View style={[styles.pickerContainer, { flexDirection: 'row' }]}>
                            <Text style={[gstyles.OpenSans_Bold(16, '#000000'), { left: 15, maxWidth: WIDTH * 0.78 }]}>{selectedItem}</Text>
                            {modal && <AntDesign name='caretup' size={15} color='black' style={{ right: 15 }} />}
                                {!modal&&props?.selectedFilter.length>2 &&<AntDesign name='caretdown' size={15} color='black' style={{ right: 15 }} />}
                        </View>
                    </TouchableOpacity>} */}




{props?.selectedFilter.length> 2 &&<View style={{position:'relative', zIndex:2000}}>
                    {props?.selectedFilter.length> 2 && (
        <TouchableOpacity
          disabled={props?.selectedFilter.length === 1 || props?.selectedFilter?.length === 2}
          style={styles.inputContainer}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <View style={[styles.pickerContainer, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={[gstyles.OpenSans_Bold(16, '#000000'), { left: 15, maxWidth: WIDTH * 0.78 }]}>{selectedItem}</Text>
            {dropdownVisible ? (
              <AntDesign name='caretup' size={15} color='black' style={{ marginLeft: 'auto' }} />
            ) : (
              props?.selectedFilter.length > 2 && (
                <AntDesign name='caretdown' size={15} color='black' style={{ marginLeft: 'auto' }} />
              )
            )}
          </View>
        </TouchableOpacity>
      )}

     

{dropdownVisible&&<Animated.View 
style={[styles.dropdownContainer,{ borderBottomWidth: dropdownVisible&&props?.selectedFilter.length > 2 ? 1 : 0 }, {}]}>
      <FlatList
        data={props.selectedFilter}
        // keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </Animated.View>}

    {/* <DropdownComponent
    data={props?.selectedFilter}
    /> */}
</View>}


        
 
                <View style={styles.amountData}>
                    <View style={{borderWidth:.05,borderRadius:2,width:widthRole,height:HEIGHT*.1,padding:10,gap:10}}>
                        <Text style={{color:"black",fontWeight:"bold"}}>Redemptions Amount</Text>
                      { arrayLength>0&& <Text style={styles.count}>Rs.{totalRedeeemdAmount}</Text>}
                      { arrayLength===0&& <Text style={styles.count}>Rs.{totalRedeeemdAmount}</Text>}
                    </View>
 
                    {menuItems!==0&&<View style={{borderWidth:.05,borderRadius:2,width:"50%",height:HEIGHT*.1,padding:10,gap:10}}>
                        <Text style={{color:"black",fontWeight:"bold"}}>Item QTY</Text>
                       { arrayLength>0&&<Text style={styles.count}>{menuItems}</Text>}
                       { arrayLength===0&&<Text style={styles.count}>{menuItems}</Text>}
                    </View>}
                   
                </View>
               
 
                <View style={[gstyles.inRowJSB, gstyles.centerX, { width: WIDTH - 40 }]}>
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={props.isBtnSelected == 'unsettled' ? ['#8338EC', '#3A86FF'] : ['#FFFFFF', '#FFFFFF']}
                        style={styles.settleBtnTouch}>
                        <TouchableOpacity activeOpacity={0.6}
                            style={props.isBtnSelected == 'unsettled' ? styles.btnTouch : [styles.btnTouch, styles.unSettleBtnTouch]}
                            onPress={() => { props.setIsBtnSelected('unsettled') }}
                        >
                           {props?.selectedFilter.length===1?<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'unsettled' ? '#FFFFFF' : '#0276E5')}>
                                {/* Unsettled ({props.usTransactions.length}) */}
                                Unsettled (0)
                            </Text>:<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'unsettled' ? '#FFFFFF' : '#0276E5')}>
                                {/* Unsettled ({props.usTransactions.length}) */}
                                Unsettled ({props.countUnSettled})
                            </Text>}
                        </TouchableOpacity>
                    </LinearGradient>
 
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={props.isBtnSelected == 'settled' ? ['#8338EC', '#3A86FF'] : ['#FFFFFF', '#FFFFFF']}
                        style={styles.settleBtnTouch}
                    >
                        <TouchableOpacity activeOpacity={0.6}
                            style={props.isBtnSelected == 'settled' ? styles.btnTouch : [styles.btnTouch, styles.unSettleBtnTouch]}
                            onPress={() => { props.setIsBtnSelected('settled') }}
                        >
                           {props?.selectedFilter.length===1? <Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'settled' ? '#FFFFFF' : '#0276E5')}>
                                Settled (0)
                            </Text>:<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'settled' ? '#FFFFFF' : '#0276E5')}>
                                Settled ({props.countSettled})
                            </Text>}
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
 
                {arrayLength>0 && <View style={[gstyles.mt(15), gstyles.inRowJSB, { width: WIDTH - 35 }, gstyles.centerX]}>
                    <Text style={gstyles.OpenSans_SemiBold(14, '#000000')}>
                        Recent Transactions
                    </Text>
                 
                    {props?.selectedFilter.length>1&&<TouchableOpacity style={{padding:10,left:10}}  onPress={() => { props.onClickSearchIcon() }} >
               <Text style={{color:"blue"}}>View all</Text>
                </TouchableOpacity>}
                </View> }
 
 
                <FlatList
                     data={dataView}
                     renderItem={renderRecentTrans}
                     keyExtractor={item => item.id}
                     showsVerticalScrollIndicator={false}
                    //  scrollEnabled={false}
                     ListEmptyComponent={_renderNoTrans}
                    onEndReachedThreshold={1}
                    refreshControl={
                        <RefreshControl
                          refreshing={props.isRefreshing}
                          onRefresh={() => {
                            props.setisRefreshing(true);
                            props.getTransactions();
                            props.getEvents()
                          }}
                        />
                      }
                     />
 
            </View>
            {props.isDetailModal.visible &&
                <RedeemedDetailsModal
                    isDetailModal={props.isDetailModal.visible}
                    userData={props.userData}
                    data={props.isDetailModal.data}
                    setIsDetailModal={props.setIsDetailModal}
                    onClickMoveToSettled={props.onClickMoveToSettled} />}
         
                   
            <LoadingModel loading={props.isLoading}/>
        </>
    );
}
 
export default HomeComponent;
 
const styles = StyleSheet.create({
 
    header: {
        width: WIDTH,
        borderBottomColor: '#0276E526',
        borderBottomWidth: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        ...gstyles.inRowJSB,
        paddingHorizontal: 20,
        elevation: 3,
    },
 
    totalRedeemCard: {
        width: WIDTH - 35,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        alignSelf: 'center',
        borderWidth: 0.9,
        borderColor: '#0276E51A',
        marginTop: 15,
        marginBottom: 15
    },
 
    settleBtnTouch: {
        width: '49%',
        height: 42,
        borderRadius: 4,
        ...gstyles.centerXY
    },
 
    unSettleBtnTouch: {
        backgroundColor: '#FFFFFF',
        borderColor: '#0276E5',
        borderWidth: 1
    },
 
    btnTouch: {
        width: '100%',
        height: 42,
        ...gstyles.centerXY,
        borderRadius: 4
    },
 
    transCardView: {
       
        width: WIDTH - 35,
        alignSelf: 'center',
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#0276E51A',
    },
 
    inputText: {
        fontSize: 16,
        fontFamily: OpenSans_Medium,
        color: '#000000',
        // marginLeft: 5,
        width: WIDTH - 35,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center'
    },
    amountData:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        gap:10,
        padding:20
    },
    btnFilter: {
        flexDirection: 'row',
        gap:7,
        left:20,
        paddingVertical:10,
       
       
    },
    btnFilter2: {
        flexDirection: 'row',
        top:10,  
        gap:7,
        left:20,
       marginBottom:20,
    },
    filterButton: {
        borderWidth: .4,
        borderRadius:2,
        padding: 5,
        borderColor: 'blue',
        backgroundColor: 'white',
    },
    selectedButton: {
        backgroundColor: 'blue',
        borderRadius:3,
        padding: 5,
       
    },
    selectedText:{
        color:"white",
       
       
    },
    filterText: {
        color:  '#3A86FF',
        fontSize: 10,
       
    },
    count:{
        color:"blue",
        fontWeight:"bold",
        fontSize:20,
       
    },
    scrollView:{
        // borderWidth:1,
        marginBottom:80
    },
    pagination:{
        // borderWidth:1,
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        gap:100
       
 
    },
    modalContainer: {
        borderWidth:2,
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop:HEIGHT*.15
    },
    modalView: {
        width: WIDTH * 0.85,
        backgroundColor: '#ffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderRadius: 4,
        padding: 20,
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    pickerContainer: {
        borderColor: "#3A86FF20",
        borderRadius: 5,
        borderBottomWidth: 2,
        borderWidth: 0.5,
        width: WIDTH * 0.91,
        // height: HEIGHT * 0.06,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0F6FF30',
        // marginTop:0,
        padding:10
    },
    dropdown:{
        borderWidth:3,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 60,  
        left: 18,
        right: 0,
        backgroundColor: 'white',
        zIndex: 1000,
        width: WIDTH * 0.9,
        borderBottomColor: 'rgba(0, 0, 0, 0.15)',
        // borderBottomWidth: 1,  

        elevation: 4, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        borderRadius:4,
        
      },




      dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 35,
        paddingTop:15,
        // backgroundColor:"grey"
        
        // borderWidth:1,
      },
   
 
});