import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { gstyles } from '../../components/common/GlobalStyles';
import LinearGradient from "react-native-linear-gradient";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { OpenSans_Medium, WIDTH, app_Bg, HEIGHT } from '../../components/common/Constants';

const RedeemCoupon = ({ refRBSheet, isVisible, onClose }) => {
    

    return (
        <RBSheet
            ref={refRBSheet}
            closeOnDragDown={false}
            closeOnPressMask={false}
            animationType={'slide'}
            openDuration={250}
            onClose={onClose}
            customStyles={{
                wrapper: {
                    backgroundColor: 'rgba(0,0,0,0.5)'
                },
                draggableIcon: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    width: 50,
                    borderRadius: 4

                },
                container: {
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    height: WIDTH * 1.45
                }
            }}
        >
            <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                <View style={[gstyles.centerX, gstyles.mt(15), gstyles.mb(25)]}>
                    <Text style={gstyles.OpenSans_SemiBold(20, '#0276E5')}>
                        Redeem Coupon
                    </Text>
                </View>
                <TouchableOpacity activeOpacity={0.6}
                    style={{ position: 'absolute', right: 25, top: 15 }}
                    
                >
                    <AntDesign name='close' size={25} color='#0276E5' />
                </TouchableOpacity>

                <View style={[gstyles.inRowJSB, gstyles.centerX, { width: WIDTH - 35, marginTop: 24, marginBottom: 25 }]}>
                    {/* <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#FFFFFF', '#FFFFFF']} style={[styles.settleBtnTouch, { height: 50 }]}>
                        <TouchableOpacity activeOpacity={0.6}
                            style={[styles.btnTouch, styles.unSettleBtnTouch, { height: 50 }]}
                        >
                            <Text style={gstyles.OpenSans_Bold(20, '#0276E5')}>
                                Scan Bill
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient> */}

                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#8338EC', '#3A86FF']} style={[styles.settleBtnTouch, { height: 50 }]}
                    >
                        <TouchableOpacity  activeOpacity={0.6}
                            style={[styles.btnTouch, { height: 50 }]}
                        >
                            <Text style={gstyles.OpenSans_Bold(20, '#FFFFFF')}>
                                Redeem
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>
        </RBSheet>
    )
}

export default RedeemCoupon;

const styles = StyleSheet.create({

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
        width: '49.9%',
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


});