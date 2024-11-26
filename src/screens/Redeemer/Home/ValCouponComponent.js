import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    StatusBar,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image, Dimensions, ScrollView,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { gstyles } from '../../../components/common/GlobalStyles';
import { OpenSans_Medium, WIDTH, app_Bg, HEIGHT } from '../../../components/common/Constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera';

import LoadingModel from "../../../components/common/Loading"
import CouponVerificationModal from "../../../components/Redeemer/CouponVerificationModal"
import { showToast } from "../../../components/common/ShowToast"
import CouponExpireModal from "../../../components/Redeemer/CouponExpireModal"
import CouponExpiredModal from "../../../components/Validator/CouponExpiredModal"
import RBSheet from "react-native-raw-bottom-sheet";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Modal, TextInput } from 'react-native-paper';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CouponAlreadyVerified from '../../../components/Validator/CouponAlreadyVerified';
import CouponVerified from '../../../components/Validator/CouponVerified2'
import { useNavigation } from '@react-navigation/core';
import BalanceDrinksModal from "../../../components/Redeemer/BalanceDrinksModal"
import DrinkRedeemConfirmation from "../../../components/Redeemer/DrinkRedeemConfirmation"
import MenuItemsModal from '../../../components/Redeemer/MenuItemsModal';
import AlertTableRelease from '../../../components/Redeemer/AlertTableRelease';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TableRelSelModal from '../../../components/Redeemer/TableRelSelModal';



const ValCouponComponent = props => {
  const {height, width} = Dimensions.get('window');
  const QR_BOX_SIZE = 250;
  const verticalHeight = (height - 120 - QR_BOX_SIZE) / 2;
  const verticalWidth = width;
  const horizontalHeight = QR_BOX_SIZE;
  const horizontalWidth = (width - QR_BOX_SIZE) / 2;
  const inputRef = useRef();
  const tableRef = useRef(null)
  const platform = Platform.OS == 'ios';
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [modalOpen,setModalOpen] = useState(false)
  const [selectedTableName,setSelectedTableName] = useState('')
  // const [clear,setClear] = useState(false)
  const clearTable = props.clearTable
  const {tabelCondition} =props
  const clearRespo = props.clearRespo
  const getTabelOccupied  = props.getTabelOccupied
  const tabelReleaseStatus = props.tabelReleaseStatus
  const tabelNormalRes = props.tabelNormalRes



  // console.log('........................................clear.........................................',clear)
  
  const tableBookingData = props.tableBookingData
  const onClickTableRele = props.onClickTableRele
  const onClickRedeem = props.onClickRedeem
  const tableName = props.tableName
  const sectionName = props.sectionName
  const filteredData = props.filteredData


  console.log('------selectedTableName-----tabelName-/.......',tableName)

  

  console.log('----------selectedTableName--------',selectedTableName)


  const displayText = Array.isArray(tableNameListMap) && tableNameListMap.length > 0
  ? tableNameListMap.length === 1
    ? tableNameListMap[0]
    : `${tableNameListMap[0]} +${tableNameListMap.length - 1}`
  : '';


  // const filtertableName = tableName===undefined?[]:tableName


  // const tabelNameListMap = filtertableName?.length>0?filtertableName:selectedTableName?.map((item)=>{return item})
  const filterTableName = tableName || [];
   
  const tableNameListMap = filterTableName.length > 0 
  ? filterTableName 
  : (selectedTableName ? selectedTableName.map(item => item) : []);
  // const tabelNameListMap = []

  console.log('.....tabelNameListMap............',tableNameListMap)


  const handleTableSelection =()=>{

    if(tableName.length===0){
 if (tableRef.current) {
      tableRef.current.open();
      getTabelOccupied()  // Open RBSheet using the ref
    }
    }
   
  }


  const handleSelectedTableName =(e)=>{
    setSelectedTableName(e)
  }

  const handleClose =()=>{
    setIsChecked(false)
    // setClear(true)
    tabelCondition(true)
  }



  const handleToggle = () => {
    setIsChecked(!isChecked);
    // setModalOpen(true) // Toggle checkbox state
  };

  const  handleModalChange =()=>{
    setModalOpen(false)
  }

  const handleClearTable =()=>{
    // setSectionName([])
    // setTableName([])
  }
  

  const onCliclRedeem = async () => {
    props.refRBSheet.current.open();
    
  };

  const onCliclRedeemDrinks = async () => {
    props.freeDrinksRefRBSheet.current.open();
  };
  // by drinks
  const onCliclByDrinks = async () => {
    props.byDrinksRefRBSheet.current.open();
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      props.setcouponStatus('pending');
    });
  }, [navigation]);

  const handleOncheck =()=>{
    setIsChecked(!isChecked)
  }
  const handleConfirm =(e)=>{
    setModalOpen(false)
  }

  useEffect(() => {
    props.settableNumber(Array.isArray(tableNameListMap) ? tableNameListMap.join(', ') : '');
  }, [tableNameListMap]);

  useEffect(() => {
    console.log(inputRef);
    if (inputRef.current) {
      inputRef.current?.forceFocus();
    }
  }, [inputRef, props.couponStatus]);

  return (
    <>
      <StatusBar
        backgroundColor={app_Bg}
        animated={true}
        barStyle="dark-content"
      />
      <View style={[gstyles.container(app_Bg)]}>
        <View
          style={[
            styles.header,
            platform ? {paddingTop: HEIGHT * 0.04} : null,
          ]}>
          <View style={[gstyles.inRow, {alignItems: 'center'}]}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props.onClickBack();
              }}>
              <MaterialIcons name="arrow-back" size={25} color="#3F3F3F" />
            </TouchableOpacity>
            <Text
              style={gstyles.OpenSans_SemiBold(18, '#000000', gstyles.ms(15))}
              numberOfLines={1}>
              Validate Coupon
            </Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <RNCamera
            mirrorImage={false}
            captureAudio={false}
            defaultTouchToFocus={true}
            defaultOnFocusComponent={true}
            aspect={1}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            flashMode={
              props.isFlash == true
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              alignSelf: 'center',
            }}
            
            onBarCodeRead={data => {
              console.log('..........data............data............',data)
              if (props.couponStatus == 'pending') {
                props.onBarCodeRead(data);
              }
            }}>
            <View style={{flex: 1}}>
              <View
                style={{
                  width: verticalWidth,
                  height: verticalHeight,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              />

              <View style={{height: QR_BOX_SIZE, flexDirection: 'row'}}>
                <View
                  style={{
                    width: horizontalWidth,
                    height: horizontalHeight + 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                />
                <View style={{width: QR_BOX_SIZE, height: QR_BOX_SIZE}}>
                  <Image
                    source={require('../../../assets/images/scan_gif.gif')}
                    style={gstyles.iconSize(QR_BOX_SIZE)}
                  />
                </View>
                <View
                  style={{
                    width: horizontalWidth,
                    height: horizontalHeight + 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                />
              </View>
              <View
                style={{
                  width: verticalWidth,
                  height: verticalHeight,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 40,
                flexDirection: 'row',
                right: 40,
              }}>
              <TouchableOpacity
                onPress={() => {
                  props.setIsFlash(!props.isFlash);
                }}
                style={{
                  fontSize: 18,
                  fontFamily: OpenSans_Medium,
                  color: '#fff',
                  marginTop: 15,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                }}>
                <Icons
                  name={props.isFlash == true ? 'flash-off' : 'flash'}
                  size={25}
                  color={'#0276E5'}
                />
              </TouchableOpacity>
            </View>
          </RNCamera>
        </View>

        <LoadingModel loading={props.isLoading} />



        <TableRelSelModal
        ref={tableRef}
        filteredData={filteredData}
        onSelectedTableName = {handleSelectedTableName}
        clearTable={clearTable}
        clearRespo={clearRespo}
        getTabelOccupied={getTabelOccupied}
        // clear={clear}
        />





        <CouponExpireModal
          visible={props.couponStatus == 'expired'}
          setcouponStatus={props.setcouponStatus}
          couponData={props.couponData}
        />

        <CouponVerificationModal
          sum={props.sum}
          isVisible={props.couponStatus == 'verified'}
          setcouponStatus={props.setcouponStatus}
          couponData={props.couponData}
          onCliclRedeem={onCliclRedeem}
          onCliclRedeemDrinks={onCliclRedeemDrinks}
          onCliclByDrinks={onCliclByDrinks}
          userData={props.userData}
        />

        <MenuItemsModal
          refRBSheet={props.refRBSheet}
          handleRedeem={props.handleRedeem}
          state={props.state}
          userToken={props.userData}
          testData={props.testData}
          newData={props.newData}
          sum={props.sum}
          quantity={props.quantity}
          freeDrinksRefRBSheet={props.freeDrinksRefRBSheet}
          menu={props.menu}
          ticketId={props.ticketId}
          freeDrinks={props.freeDrinks}
          couponData={props.couponData}
          userData={props.userId}
          setcouponStatus={val => props.setcouponStatus(val)}
          onClickRedeemDrinks={selectedItems => props.onClickRedeemDrinks(selectedItems)}
        />

        {/*  */}
        <BalanceDrinksModal
          byDrinksRefRBSheet={props.byDrinksRefRBSheet}
          freeDrinks={props.freeDrinks}
          couponData={props.couponData}
          refRBSheet={props.refRBSheet}
          setcouponStatus={val => props.setcouponStatus(val)}
          onClickRedeemFreeDrinks={(
            freeDrinkss,
            totaladdedfreeDrinks,
            excessAmout,
          ) => {
            if (excessAmout > 0) {
              props.setopenBreakdownmodal({
                visible: true,
                data: {
                  freeDrinks: freeDrinkss,
                  total: totaladdedfreeDrinks,
                  excessAmout: excessAmout,
                },
              });
            } else {
              props.onClickRedeemByDrinks(freeDrinkss, '');
            }
          }}
          onCliclRedeem={onCliclRedeem}
        />

        <DrinkRedeemConfirmation
          isVisible={props.openBreakdownmodal.visible}
          openBreakdownmodal={props.openBreakdownmodal}
          setopenBreakdownmodal={props.setopenBreakdownmodal}
          onCliclRedeem={(freeDrinkss, paymentMode) =>
            props.onClickRedeemByDrinks(freeDrinkss, paymentMode)
          }
        />

        <RBSheet
          ref={props.refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={false}
          animationType={'slide'}
          openDuration={250}
          // onClose={() => setIsChecked(false)}
          onClose={handleClose}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            draggableIcon: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              width: 50,
              borderRadius: 4,
            },
            container: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: tableName?.length>0?WIDTH * 1.35:WIDTH * 1.25,
              
            },
          }}>
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}>
            <View style={[gstyles.centerX, gstyles.mt(15), gstyles.mb(25)]}>
              <Text style={gstyles.OpenSans_SemiBold(20, '#0276E5')}>
                Redeem Coupon
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{position: 'absolute', right: 25, top: 15}}
              onPress={() => {
                props.refRBSheet.current.close();
                // props.setcouponStatus('pending');
                props.setbillAmount('');
                props.setredeemAmount('');
                props.settableNumber('');
                props.setremarks('');
              }}>
              <AntDesign name="close" size={25} color="#0276E5" />
            </TouchableOpacity>
            <View style={[gstyles.inRowJSB, gstyles.px(16)]}>
              <View style={[gstyles.inRow, gstyles.mt(10)]}>
                <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                  Coupon ID
                </Text>
                <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                  :{'  '}
                  <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                    {props.couponData.ticket_tracking_id}
                  </Text>
                </Text>
              </View>
              <View style={[gstyles.inRow, gstyles.mt(10)]}>
                <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                  Balance
                </Text>
                <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                  :{'  '}
                  <Text style={gstyles.OpenSans_Bold(16, '#0276E5')}>
                    {'\u20B9'}{' '}
                    {Math.round(props.couponData.ticket_balence).toFixed(2)}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={[gstyles.mt(25)]}>
              <TextInput
                ref={inputRef}
                mode="outlined"
                label="Redeem Amount"
                placeholder="Enter Redeem Amount"
                style={styles.inputText}
                outlineColor="#0276E5"
                keyboardType="number-pad"
                maxLength={5}
                left={
                  <TextInput.Icon
                    icon={'currency-inr'}
                    iconColor="#3F3F3F"
                    size={22}
                  />
                }
                value={props.redeemAmount}
                onChangeText={text => {
                  const re = /^[0-9\b]+$/;
                  if (text === '' || re.test(text)) {
                    props.setredeemAmount(text);
                  }
                }}
              />
            </View>
            {/* <View style={{ width: WIDTH - 35, alignSelf: 'center' }}>
                            <Text style={gstyles.OpenSans_Regular(14, '#FF0000', gstyles.mt(5))}>
                                *Entered amount exceeds Rs.{props.redeemAmount-props.couponData.value}
                            </Text>
                        </View> */}
            {props.redeemAmount >
              Math.round(props.couponData.ticket_balence) && (
              <View style={{width: WIDTH - 35, alignSelf: 'center'}}>
                <Text
                  style={gstyles.OpenSans_Regular(
                    12,
                    '#FF0000',
                    gstyles.mt(2),
                  )}>
                  *Amount Exceeded! Redeem Rs.
                  {Math.round(props.couponData.ticket_balence)} & collect excess
                  of Rs.
                  {props.redeemAmount -
                    Math.round(props.couponData.ticket_balence)}
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: WIDTH - 35,
                alignSelf: 'center',
              }}>
              <View style={[gstyles.mt(20)]}>
                <TextInput
                  mode="outlined"
                  label="Bill Number"
                  placeholder="Enter Bill Number"
                  style={styles.inputText1}
                  outlineColor="#0276E5"
                  keyboardType="number-pad"
                  maxLength={10}
                  left={
                    <TextInput.Icon
                      icon={'ticket-confirmation-outline'}
                      iconColor="#3F3F3F"
                      size={22}
                    />
                  }
                  value={props.billAmount}
                  onChangeText={text => {
                    props.setbillAmount(text);
                  }}
                />
              </View>












{/* if table res is not there for vendor */}


             {tabelReleaseStatus==="false"&& <View style={[gstyles.mt(20)]}>
                <TextInput
                  mode="outlined"
                  label="Table Number"
                  placeholder="Enter Table Number"
                  style={styles.inputText1}
                  outlineColor="#0276E5"
                  keyboardType="number-pad"
                  maxLength={10}
                  left={
                    <TextInput.Icon
                      icon={'ticket-confirmation-outline'}
                      iconColor="#3F3F3F"
                      size={22}
                    />
                  }
                  value={tabelNormalRes}
                  onChangeText={text => {
                    props.setTableNormalRes(text);
                  }}
                />
              </View>}


{/*  */}

















              {tabelReleaseStatus==="true"&&<TouchableOpacity onPress={handleTableSelection} style={[gstyles.mt(20)]}>
                <TextInput
                  mode="outlined"
                  label="Table number"
                  placeholder="Table number"
                  style={styles.inputText1}
                  outlineColor="#0276E5"
                  // defaultValue='eeeeeeeeee'
                  // value={tabelNameListMap}
                  // value={Array.isArray(tableNameListMap) ? tableNameListMap.join(', ') : ''}
                  value={
                    Array.isArray(tableNameListMap) && tableNameListMap.length > 0
                      ? tableNameListMap.length === 1
                        ? tableNameListMap[0] 
                        : `${tableNameListMap[0]} +${tableNameListMap.length - 1}` 
                      : ''
                  }
                  maxLength={10}
                  editable={false}
                  left={
                    <TextInput.Icon
                      icon={'ticket-confirmation-outline'}
                      iconColor="#3F3F3F"
                      size={22}
                    />
                  }
                  
                  // value={props.tableNumber}

                  // onChangeText={text => {
                  //   props.settableNumber(text);
                  // }}
                />
               
              </TouchableOpacity>}
              
            </View>







            <View style={[gstyles.mt(24)]}>
              <TextInput
                mode="outlined"
                label="Remarks"
                placeholder="Enter Remarks"
                style={styles.inputText}
                outlineColor="#0276E5"
                maxLength={250}
                left={
                  <TextInput.Icon
                    icon={'note-text'}
                    iconColor="#3F3F3F"
                    size={22}
                  />
                }
                value={props.remarks}
                onChangeText={text => {
                  props.setremarks(text);
                }}
              />
            </View>




            <View style={{ display: "flex", paddingHorizontal:20,paddingTop:20}}>
              
   {  tableName!==undefined&&tableName.length>0&& tableName[0]!==null&& <View style={{ display: "flex", borderWidth: 0.2,borderRadius:3, borderColor: "grey", padding: 10, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{display:'flex',gap:10}}>
          <View style={{display:"flex",flexDirection:"row",gap:5}}>
          {isChecked ?<TouchableOpacity style={{display:"flex",flexDirection:"row",gap:10,justifyContent:"center",alignItems:"center"}} onPress={handleToggle}>
          <AntDesign
            name={isChecked ? "checksquare" : "checksquareo"} 
            size={20}
            color="#78afff"
          />
          <Text style={{ color: "grey" }}>Release Guest Table</Text>
        </TouchableOpacity>:
        <TouchableOpacity style={{display:"flex",flexDirection:"row",gap:10,justifyContent:"center",alignItems:"center"}} onPress={handleToggle}>
        <View style={{width:20,height:20,borderWidth:1,borderColor:"#6f8fd5",borderRadius:3}}></View>

        <Text style={{ color: "grey" }}>Release Guest Table</Text>
        </TouchableOpacity>}
        
          </View>
      


        {/* {isChecked&&<View style={styles.infoContainer}>
            

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
          </View>} */}

        </View>
      
      </View>
}
     
    </View>




    {modalOpen &&<AlertTableRelease
    tableName={tableName}
    sectionName={sectionName}
    onClearTable={handleClearTable}
    onModalChange={handleModalChange}
    onClickRedeem={onClickRedeem}
    onClickTableRele={onClickTableRele}
    onCheckChange={handleOncheck}
    onConfirm={handleConfirm}
    />}

            
          </ScrollView>

          <View
              style={[
                gstyles.inRowJSB,
                gstyles.centerX,
                {width: WIDTH - 35, marginTop: 24, marginBottom: 25},
              ]}>
              {/* <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                colors={['#FFFFFF', '#FFFFFF']}
                style={[styles.settleBtnTouch, {height: 50}]}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={[
                    styles.btnTouch,
                    styles.unSettleBtnTouch,
                    {height: 50},
                  ]}
                  onPress={() => showToast('Coming soon..!')}>
                  <Text style={gstyles.OpenSans_Bold(20, '#0276E5')}>
                    Scan Bill
                  </Text>
                </TouchableOpacity>
              </LinearGradient> */}

              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                colors={['#8338EC', '#3A86FF']}
                style={[styles.settleBtnTouch, {height: 50},{width:WIDTH*.90}]}>
                <TouchableOpacity
                  onPress={() => {
                    if (!isChecked) { 
                    props.onClickRedeem(); 
                    }
                    if(isChecked){
                      setModalOpen(true)
                    }
                  }}
                  activeOpacity={0.6}
                  style={[styles.btnTouch, {height: 50}]}>
                  <Text style={gstyles.OpenSans_Bold(20, '#FFFFFF')}>
                    Redeem
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
        </RBSheet>

        <Modal transparent visible={props.seekPremission} animationType="fade">
          <View
            style={{
              backgroundColor: '#fff',
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={async () => {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.CAMERA,
                );
                const result = await request(PERMISSIONS.IOS.CAMERA);
                if (
                  granted == PermissionsAndroid.RESULTS.GRANTED ||
                  result === RESULTS.GRANTED
                ) {
                  props.setSeekPremission(false);
                }
              }}>
              <Text>seekPremission</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default ValCouponComponent;

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
    inputText1: {
        fontSize: 16,
        fontFamily: OpenSans_Medium,
        color: '#000000',
        // marginLeft: 5,
        width: WIDTH/2-25,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center'
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
    infoContainer: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
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


});