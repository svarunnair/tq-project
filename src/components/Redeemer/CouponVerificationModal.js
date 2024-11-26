import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StatusBar, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { WIDTH } from '../common/Constants';
import { gstyles } from '../common/GlobalStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CouponVerificationModal = (props) => {

  const [role, setRole] = useState(null)

  // console.log("............props.couponData.item_balence.....**............",props.couponData);

  useEffect(() => {
    const roledata = async () => {
      try {
        const roleCheck = await AsyncStorage.getItem('role');
        
        if (roleCheck !== null) {
          setRole(roleCheck); 
          // console.log('.......roleCheck gotit........', roleCheck);
        }
        
      } catch (err) {
        console.log('error...', err);
      }
    };
  
    roledata();
  }, []);

    return (
      <Modal
        transparent
        visible={props.isVisible}
        animationType="fade"
        onRequestClose={() => {
          props.setcouponStatus('pending');
        }}>
        <StatusBar
          backgroundColor={'rgba(0,0,0,0.5)'}
          barStyle="light-content"
          animated
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <LottieView
              source={require('../../assets/gif/animation_correct.json')}
              style={[
                gstyles.iconSize(140, 140),
                gstyles.centerX,
                gstyles.mt(25),
                gstyles.mb(15),
              ]}
              autoPlay
              loop
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props.setcouponStatus('pending');
              }}
              style={{position: 'absolute', right: 30, top: 30}}>
              <AntDesign name="close" size={25} color="#0276E5" />
            </TouchableOpacity>
            <Text
              style={gstyles.OpenSans_SemiBold(20, '#0276E5', gstyles.centerX)}>
              Coupon Verified Successfully
            </Text>
            <View style={[gstyles.inRow, gstyles.ms(35), gstyles.mt(20)]}>
              <Text
                style={gstyles.OpenSans_Regular(
                  16,
                  '#000000',
                  gstyles.size('35%'),
                )}>
                Coupon ID
              </Text>
              <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                :{'    '}
                <Text style={gstyles.OpenSans_Bold(16, '#000000')}>
                  {props.couponData.ticket_tracking_id}
                </Text>
              </Text>
            </View>
            <View style={[gstyles.inRow, gstyles.ms(35), gstyles.mt(14)]}>
              <Text
                style={gstyles.OpenSans_Regular(
                  16,
                  '#000000',
                  gstyles.size('35%'),
                )}>
                Created at
              </Text>
              <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                :{'    '}
                {moment(props.couponData.ticket_created_at).format(
                  'DD/MM/YY,   hh: mm A',
                )}
              </Text>
            </View>
            <View style={[gstyles.inRow, gstyles.ms(35), gstyles.mt(14)]}>
              <Text
                style={gstyles.OpenSans_Regular(
                  16,
                  '#000000',
                  gstyles.size('35%'),
                )}>
                Valid till
              </Text>

              <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
               :{'    '}{moment(props.couponData.event_end).format('DD/MM/YY,   hh: mm A')}
              </Text>
              
              
            </View>
            <View
              style={[
                gstyles.inRow,
                gstyles.ms(35),
                gstyles.mt(14),
                {marginBottom: props.couponData.ticket_balence > 0 ? 0 : 20},
              ]}>
              {props.couponData.item_balence === 0 &&
              props.couponData.ticket_balence !== 0 ? (
                <Text
                  style={gstyles.OpenSans_Regular(
                    16,
                    '#000000',
                    gstyles.size('35%'),
                  )}>
                  Balance
                </Text>
              ) : null}

              {props.couponData.ticket_balence === 0 &&
              props.couponData.item_balence !== 0 ? (
                <Text
                  style={gstyles.OpenSans_Regular(
                    16,
                    '#000000',
                    gstyles.size('35%'),
                  )}>
                  Item
                </Text>
              ) : null}

              {props.couponData.ticket_balence !== 0 &&
              props.couponData.item_balence !== 0 ? (
                <Text
                  style={gstyles.OpenSans_Regular(
                    16,
                    '#000000',
                    gstyles.size('35%'),
                  )}>
                  Balance | Item
                </Text>
              ) : null}

              {/* when both are zero  */}
              {props.couponData.ticket_balence === 0 &&
              props.couponData.item_balence === 0 ? (
                <Text
                  style={gstyles.OpenSans_Regular(
                    16,
                    '#000000',
                    gstyles.size('35%'),
                  )}>
                  Balance | Item
                </Text>
              ) : null}

              {/* {props.couponData.item_balence===0?<Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                            :{'    '}<Text style={gstyles.OpenSans_SemiBold(22, '#0276E5')}>
                                {'\u20B9'} {Math.round(props.couponData.ticket_balence).toFixed(2)} 
                            </Text>
                        </Text>:<Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                            :{'    '}<Text style={gstyles.OpenSans_SemiBold(22, '#0276E5')}>
                                {'\u20B9'} {Math.round(props.couponData.ticket_balence).toFixed(2)} | 
                                {props.couponData.item_balence}
                            </Text>
                        </Text>} */}

              {props.couponData.item_balence !== 0 &&
              props.couponData.ticket_balence !== 0 ? (
                <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                  :{'    '}
                  <Text style={gstyles.OpenSans_SemiBold(22, '#0276E5')}>
                    {'\u20B9'}{' '}
                    {Math.round(props.couponData.ticket_balence).toFixed(2)} |
                    {props.couponData.item_balence}
                  </Text>
                </Text>
              ) : null}

              {/* if both are zero */}
              {props.couponData.item_balence === 0 &&
              props.couponData.ticket_balence === 0 ? (
                <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                  :{'    '}
                  <Text style={gstyles.OpenSans_SemiBold(22, '#0276E5')}>
                    {'\u20B9'}{' '}
                    {Math.round(props.couponData.ticket_balence).toFixed(2)} |
                    {props.couponData.item_balence}
                  </Text>
                </Text>
              ) : null}

              {props.couponData.item_balence === 0 &&
              props.couponData.ticket_balence !== 0 ? (
                <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                  :{'    '}
                  <Text style={gstyles.OpenSans_SemiBold(22, '#0276E5')}>
                    {' '}
                    {'\u20B9'}{' '}
                    {Math.round(props.couponData.ticket_balence).toFixed(2)}
                  </Text>
                </Text>
              ) : null}

              {props.couponData.ticket_balence === 0 &&
              props.couponData.item_balence !== 0 ? (
                <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                  :{'    '}
                  <Text style={gstyles.OpenSans_SemiBold(22, '#0276E5')}>
                    {props.couponData.item_balence} QTY
                  </Text>
                </Text>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              {/* section1 change*/}
              {props.couponData.ticket_balence !== 0 &&
              props.couponData.item_balence === 0 ? (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'center',
                  }}>
                 { role==="Redeemer"?<LinearGradient
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 1}}
                    colors={['#8338EC', '#3A86FF']}
                    style={styles.settleBtnTouchRedeemRedeemer}>
                    <TouchableOpacity
                      onPress={() => {
                        
                        props.onCliclRedeem();
                      }}
                      activeOpacity={0.6}
                      style={styles.btnTouch}>
                      <Text style={gstyles.OpenSans_Bold(15, '#FFFFFF')}>
                        Redeem Bill
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>:<LinearGradient
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 1}}
                    colors={['#8338EC', '#3A86FF']}
                    style={styles.settleBtnTouchRedeemTwo}>
                    <TouchableOpacity
                      onPress={() => {
                        
                        props.onCliclRedeem();
                      }}
                      activeOpacity={0.6}
                      style={styles.btnTouch}>
                      <Text style={gstyles.OpenSans_Bold(15, '#FFFFFF')}>
                        Redeem Bill
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>}

                  {/*  */}
              { role!=="Redeemer"&& <LinearGradient
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 1}}
                    colors={['#8338EC', '#3A86FF']}
                    style={styles.settleBtnTouchRedeemOne}>
                    <TouchableOpacity
                      onPress={() => {
                        // 
                        props.onCliclByDrinks();
                      }}
                      activeOpacity={0.6}
                      style={styles.btnTouch}>
                      <Text style={gstyles.OpenSans_Bold(12, '#FFFFFF')}>
                        By Drinks
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>}
                </View>
              ) : null}

              {/*  */}
              {props.couponData.ticket_balence !== 0 &&
              props.couponData.item_balence !== 0 ? (
                <LinearGradient
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  colors={['#8338EC', '#3A86FF']}
                  style={styles.settleBtnTouch}>
                  <TouchableOpacity
                    onPress={() => {
                      
                      props.onCliclRedeem();
                    }}
                    activeOpacity={0.6}
                    style={styles.btnTouch}>
                    <Text style={gstyles.OpenSans_Bold(15, '#FFFFFF')}>
                      Redeem Bill
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : null}

              {/* section2 */}

              {props.couponData.item_balence > 0 &&
              props.couponData.ticket_balence > 0&&role!=="Redeemer"  ? (
                <LinearGradient
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  colors={['#8338EC', '#3A86FF']}
                  style={styles.settleBtnTouch}>
                  <TouchableOpacity
                    onPress={() => {
                      
                      props.onCliclByDrinks();
                    }}
                    activeOpacity={0.6}
                    style={styles.btnTouch}>
                    <Text style={gstyles.OpenSans_Bold(12, '#FFFFFF')}>
                      By Drinks
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : null}
              {/* by drinks */}
              {/* {props.couponData.item_balence===0 &&
              props.couponData.ticket_balence!==0 ? (
                <LinearGradient
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  colors={['#8338EC', '#3A86FF']}
                  style={styles.settleBtnTouch}>
                  <TouchableOpacity
                    onPress={() => {
                      
                      props.onCliclByDrinks();
                    }}
                    activeOpacity={0.6}
                    style={styles.btnTouch}>
                    <Text style={gstyles.OpenSans_Bold(12, '#FFFFFF')}>
                      By Drinks
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : null} */}

              {/* menu item */}

              {props.couponData.item_balence > 0 ? (
                <LinearGradient
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  colors={['#8338EC', '#3A86FF']}
                  style={styles.settleBtnTouch}>
                  <TouchableOpacity
                    onPress={() => {
                      
                      props.onCliclRedeemDrinks();
                    }}
                    activeOpacity={0.6}
                    style={styles.btnTouch}>
                    <Text style={gstyles.OpenSans_Bold(15, '#FFFFFF')}>
                      Menu Items
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    );
}

export default CouponVerificationModal;

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    modalView: {
        width: WIDTH - 35,
        backgroundColor: '#FFFFFF',
        shadowColor: '#00000066',
        shadowOffset: {
            width: 0,
            height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderRadius: 16
    },

    settleBtnTouch: {
        width: '30%',
        // width: 174,
        height: 50,
        borderRadius: 4,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 27
    },

    btnTouch: {
        width: '100%',
        height: 50,
        ...gstyles.centerXY,
        borderRadius: 4
    },
    settleBtnTouchRedeem:{
        width: '65%',
        // width: 174,
        height: 50,
        borderRadius: 4,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 27
    },
    settleBtnTouchRedeemOne:{
        width:'40%',
        // width: 174,
        height: 50,
        borderRadius: 4,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 27
    },
    settleBtnTouchRedeemTwo:{
      width:'40%',
      // width: 174,
      height: 50,
      borderRadius: 4,
      alignSelf: 'center',
      marginTop: 25,
      marginBottom: 27
  },
  settleBtnTouchRedeemRedeemer:{
    width:'65%',
    // width: 174,
    height: 50,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 27
}

});