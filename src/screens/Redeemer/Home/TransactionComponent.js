import React, { useRef, useState } from 'react';
import {
    View,
    StatusBar,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TextInput,
    RefreshControl,
    Platform
} from 'react-native';
import { gstyles } from '../../../components/common/GlobalStyles';
import { HEIGHT, OpenSans_Medium, WIDTH, app_Bg } from '../../../components/common/Constants';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RedeemedDetailsModal from '../../../components/Redeemer/RedeemedDetailsModal';
import RBSheet from "react-native-raw-bottom-sheet";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import LoadingModel from "../../../components/common/Loading"
import PopMenuModal from '../../../components/Redeemer/PopMenuModal';
 
const TransactionComponent = (props) => {
    const platform = Platform.OS =='ios';
    const [number,setNumber] = useState(0)
    const {onPage} = props    
 
    console.log('...............props.usTransactions....................',props.usTransactions);
   
    const _renderRecentTrans = ({item,index}) => {
        const parsedActionData = JSON.parse(item.action_data);
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
               
 
               
 
 
               
               
                {/* {props.userData && props.userData.role.handle!=="redeemer" ?
 
                <View style={{display:"flex"}}>
                <Text style={[
                    gstyles.OpenSans_Regular(10, '#000000'),
                    { width: WIDTH*.32}
                  ]}
                    numberOfLines={1}
                >
                    Redeemed by {item.redeemer.name}
                </Text></View> : null } */}
 
{/* {!item.bill_number&&<Text style={gstyles.OpenSans_Regular(10, '#000000')}>
                    {moment(item.createdAt).format("DD MMM YY | hh:mm A")}
                </Text> } */}
 
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
 
 
                    {props.userData  ?
 
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
            <View style={[gstyles.centerXY, { marginTop:'40%' }]}>
                <Image source={require('../../../assets/images/no_trans.png')}
                    style={[gstyles.iconSize(WIDTH / 1.8), { opacity: 0.7 }]}
                />
                <Text style={[gstyles.OpenSans_SemiBold(20, '#0276E5'), { opacity: 0.7 }]}>
                    No Transactions Found
                </Text>
            </View>
        );
    }
 
    const _renderFilterData = ({item,index}) => {
        return (
            <View>
            {index == 0 ?
                <TouchableOpacity onPress={()=>props.onChangeFilterData(-1)} activeOpacity={0.6}
                style={[gstyles.inRow, gstyles.ms(20),gstyles.mb(10)]}>
                <MaterialCommunityIcons name={props.selectedFilter=='all' ? 'checkbox-marked' : 'checkbox-blank-outline'} size={25} color={props.selectedFilter=='all' ? '#0276E5' : "#00000095"} />
                <Text style={gstyles.OpenSans_Bold(16, props.selectedFilter=='all' ? '#000000' : "#00000095", gstyles.ms(15))}>
                 {props.selectedFilter=='all' ? 'Unselect All' : 'Select All'}
                </Text>
            </TouchableOpacity> : null }
               
            <TouchableOpacity onPress={()=>props.onChangeFilterData(index)} activeOpacity={0.6}
                style={[gstyles.inRow, gstyles.ms(20),gstyles.mb(10)]}>
                <MaterialCommunityIcons name={item.selected ? 'checkbox-outline' : 'checkbox-blank-outline'} size={25} color={item.selected ? '#0276E5' : '#00000090'} />
                <Text style={[item.selected ? gstyles.OpenSans_SemiBold(16, item.selected ? '#000000' : '#00000090', gstyles.ms(15)): gstyles.OpenSans_Medium(16, item.selected ? '#000000' : '#00000090', gstyles.ms(15)),{textTransform: 'capitalize'}]}>
                    {index == 0 ? "SELF - " : null}{item.first_name} {item.last_name}
                </Text>
            </TouchableOpacity>
            </View>
        );
    }
   
 
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
                        <TouchableOpacity activeOpacity={0.6}
                            onPress={() => { props.onClickBack() }}
                        >
                            <MaterialIcons name='arrow-back' size={25} color='#3F3F3F' />
                        </TouchableOpacity>
                        <Text style={gstyles.OpenSans_SemiBold(18, '#000000', gstyles.ms(15))}
                            numberOfLines={1}
                        >
                            Transactions
                        </Text>
                    </View>
                </View>
 
                <View style={styles.searchBoxView}>
                    <View style={gstyles.inRow}>
                        <Ionicons name='ios-search-outline' size={22} color='#3F3F3F' />
                        <TextInput
                            placeholder='Search'
                            placeholderTextColor={'#3F3F3F'}
                            style={styles.inputSearchText}
                            value={props.searchQuery}
                            onChangeText={(val)=>props.onSearch(val)}
                        />
                    </View>
                    {props.userData && props.userData.role=="Biller" ?
                    <TouchableOpacity activeOpacity={0.6}
                        onPress={() =>  props.getStaffs()}
                    >
                        <FontAwesome name='filter' size={22} color='#3F3F3F' />
                    </TouchableOpacity> : null }
                </View>
 
                {props.isBtnSelected == 'unsettled'&& <View style={[gstyles.inRowJSB, gstyles.centerX, { width: WIDTH - 35 }, gstyles.mb(8)]}>
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={props.isBtnSelected == 'unsettled' ? ['#8338EC', '#3A86FF'] : ['#FFFFFF', '#FFFFFF']}
                        style={styles.settleBtnTouch}>
                        <TouchableOpacity activeOpacity={0.6}
                            style={props.isBtnSelected == 'unsettled' ? styles.btnTouch : [styles.btnTouch, styles.unSettleBtnTouch]}
                            onPress={() => { props.setIsBtnSelected('unsettled') }}
                        >
                            {props.usTransactions.length!==0&&<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'unsettled' ? '#FFFFFF' : '#0276E5')}>
                                Unsettled ({props.countUnsettled})
 
                            </Text>}
                            {props.usTransactions.length==0&&<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'unsettled' ? '#FFFFFF' : '#0276E5')}>
                                Unsettled (0)
         
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
                           { props.usTransactions.length!==0&&<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'settled' ? '#FFFFFF' : '#0276E5')}>
                                Settled ({props.countSettled})
                            </Text>}
 
                            { props.usTransactions.length===0&&<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'settled' ? '#FFFFFF' : '#0276E5')}>
                                Settled (0)
                               
                            </Text>}
                        </TouchableOpacity>
                    </LinearGradient>
                </View>}
 
 
 
               
               {props.isBtnSelected == 'settled'&& <View style={[gstyles.inRowJSB, gstyles.centerX, { width: WIDTH - 35 }, gstyles.mb(8)]}>
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={props.isBtnSelected == 'unsettled' ? ['#8338EC', '#3A86FF'] : ['#FFFFFF', '#FFFFFF']}
                        style={styles.settleBtnTouch}>
                        <TouchableOpacity activeOpacity={0.6}
                            style={props.isBtnSelected == 'unsettled' ? styles.btnTouch : [styles.btnTouch, styles.unSettleBtnTouch]}
                            onPress={() => { props.setIsBtnSelected('unsettled') }}
                        >
                            {props.sTransactions.length!==0&&<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'unsettled' ? '#FFFFFF' : '#0276E5')}>
                                Unsettled ({props.countUnsettled})
 
                            </Text>}
                            {props.sTransactions.length==0&&<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'unsettled' ? '#FFFFFF' : '#0276E5')}>
                                Unsettled (0)
         
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
                           { props.sTransactions.length!==0&&<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'settled' ? '#FFFFFF' : '#0276E5')}>
                                Settled ({props.countSettled})
                            </Text>}
 
                            { props.sTransactions.length===0&&<Text style={gstyles.OpenSans_Medium(16, props.isBtnSelected == 'settled' ? '#FFFFFF' : '#0276E5')}>
                                Settled (0)
                               
                            </Text>}
                        </TouchableOpacity>
                    </LinearGradient>
                </View>}
                {/* props.sTransactions : props.usTransactions */}
 
                    <FlatList
                    // data={props.isBtnSelected == 'settled' ? props.filteredSTransactions && props.filteredSTransactions.length>0 ? props.filteredSTransactions : props.sTransactions : props.filteredUSTransactions && props.filteredUSTransactions.length>0 ? props.filteredUSTransactions : props.usTransactions}
                    data={props.isBtnSelected == 'settled' ? props.sTransactions && props.sTransactions.length>0 && props.sTransactions  :props.usTransactions}
                    renderItem={_renderRecentTrans}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    ListEmptyComponent={_renderNoTrans}
                    onEndReached={()=>props.getTransactions('',true)}
                    onEndReachedThreshold={0.1}
                    refreshControl={
                        <RefreshControl refreshing={props.isRefreshing}
                            onRefresh={()=>{
                                props.getTransactions('','')
                            }} />
                    }
                />
 
                {props.isDetailModal.visible &&
                <RedeemedDetailsModal
                    isDetailModal={props.isDetailModal.visible}
                    data={props.isDetailModal.data}
                    setIsDetailModal={props.setIsDetailModal}
                    userData={props.userData}
                    onClickMoveToSettled={props.onClickMoveToSettled} />}
            {/* <LoadingModel loading={props.isLoading}/> */}
 
            {props.isPopMenu &&
                <PopMenuModal
                    isPopMenu={props.isPopMenu}
                    setIsPopMenu={props.setIsPopMenu}
                    selectedFilter={props.selectedFilter} />}
            </View>
        </>
    );
}
 
export default TransactionComponent;
 
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
    icon:{
        height:30,
        width:30,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center'
    },
 
    searchBoxView: {
        width: WIDTH - 35,
        alignSelf: 'center',
        height: 50,
        backgroundColor: '#FFFFFF',
        marginTop: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#0276E5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 15
    },
 
    inputSearchText: {
        fontFamily: OpenSans_Medium,
        fontSize: 16,
        color: '#000000',
        marginLeft: 12,
        width: '85%'
    },
 
    settleBtnTouch: {
        width: '49%',
        height: 42,
        // backgroundColor: '#8338EC',
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
        // height: 104,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#0276E51A',
    }
 
});