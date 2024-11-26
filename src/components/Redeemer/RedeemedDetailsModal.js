import React from 'react';
import { View, Text, Modal, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { WIDTH } from '../common/Constants';
import { gstyles } from '../common/GlobalStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

const RedeemedDetailsModal = (props) => {

    // console.log("..........props.data.excess_amount..................",props);


    console.log(';.........props.userData.role.handle....................',props.userData.role.handle)

    return (
        <Modal
            transparent
            visible={true}
            animationType="fade"
            onRequestClose={() => { props.setIsDetailModal(!props.isDetailModal) }}>
            <StatusBar
                backgroundColor={'rgba(0,0,0,0.5)'}
                barStyle="light-content"
                animated
            />
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    <View style={[gstyles.centerX, gstyles.mt(30), gstyles.mb(25)]}>
                        <Text style={gstyles.OpenSans_SemiBold(20, '#0276E5')}>
                            Redeemed Details
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.6}
                        onPress={() => { props.setIsDetailModal(!props.isDetailModal) }}
                        style={{ position: 'absolute', right: 30, top: 30 }}
                    >
                        <AntDesign name='close' size={25} color='#0276E5' />
                    </TouchableOpacity>
                    {props.data && props.data.bill_number && <View style={[gstyles.inRow, gstyles.ms(40)]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                            Bill No.
                        </Text>
                        <Text style={gstyles.OpenSans_Bold(16, '#000000')}>
                            :{'    '}{props.data.bill_number}
                        </Text>
                    </View> }
                    <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14)]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                            Coupon Id
                        </Text>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                            :{'    '}#{props.data.ticket_tracking_id}
                        </Text>
                    </View>
                    <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14)]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                            Name
                        </Text>
                        <Text numberOfLines={1} style={[gstyles.OpenSans_Regular(16, '#000000'), { maxWidth: 195 }]}>
                            :{'    '}{props.data.customer_name} 
                        </Text>
                    </View>
                    <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14)]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                            Redeemed at
                        </Text>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000')}>
                            :{'    '}{moment(props.data.createdAt).format("DD/MM/YY,  hh:mm A")}
                        </Text>
                    </View>
                    {props.data.table_number && <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14), { alignItems: 'flex-start' }]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                            Table No.
                        </Text>
                        <Text style={[gstyles.OpenSans_Regular(16, '#000000')]}>
                            :{'    '}
                        </Text>
                        <Text numberOfLines={3} style={[gstyles.OpenSans_Regular(16, '#000000'), { maxWidth: 195, paddingRight: 10, textAlign: 'left' }]}>
                        {props.data.table_number}
                        </Text>
                    </View>}
                    {props.data.remarks && <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14), { alignItems: 'flex-start' }]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                            Remarks
                        </Text>
                        <Text style={[gstyles.OpenSans_Regular(16, '#000000')]}>
                            :{'    '}
                        </Text>
                        <Text numberOfLines={3} ellipsizeMode="tail" style={[gstyles.OpenSans_Regular(16, '#000000'), { maxWidth: 185, textAlign: 'left', paddingRight: 20 }]}>
                        {props.data.remarks}
                        </Text>
                    </View>}
                    {props.data.items && JSON.parse(props.data.items).length>0 && 
                    <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14), { alignItems: 'flex-start' }]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                        Drinks QTY
                        </Text>
                        <Text style={[gstyles.OpenSans_Regular(16, '#000000')]}>
                            :{'    '}
                        </Text>
                        <Text numberOfLines={3} ellipsizeMode="tail" style={[gstyles.OpenSans_Regular(16, '#000000'), { maxWidth: 185, textAlign: 'left', paddingRight: 20 }]}>
                        {props.data.items && JSON.parse(props.data.items).length>0 ? JSON.parse(props.data.items).map((item) => {return item.quantity;}).reduce((partialSum, a) => partialSum + a, 0) : 0}
                        </Text>
                    </View>}
                    
                    {props.data.items && JSON.parse(props.data.items).length>0 && 
                    <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14), { alignItems: 'flex-start' }]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                        Drinks
                        </Text>
                        <Text style={[gstyles.OpenSans_Regular(16, '#000000')]}>
                            :{'    '}
                        </Text>
                        <Text numberOfLines={3} ellipsizeMode="tail" style={[gstyles.OpenSans_Regular(16, '#000000'), { maxWidth: 185, textAlign: 'left', paddingRight: 20 }]}>
                        {JSON.parse(props.data.items).length>0 ? JSON.parse(props.data.items).map((item) => {return item.name+"("+item.quantity+")";}).join(", ") : ""}
                        </Text>
                    </View>}
                    {props.data.excess_amount>0 && <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14), { alignItems: 'flex-start' }]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                        Excess Paid
                        </Text>
                        <Text style={[gstyles.OpenSans_Regular(16, '#000000')]}>
                            :{'    '}
                        </Text>
                        <Text numberOfLines={3} ellipsizeMode="tail" style={[gstyles.OpenSans_Regular(16, '#000000'), { maxWidth: 185, textAlign: 'left', paddingRight: 20 }]}>
                        Rs.{props.data.excess_amount} | by {props.data.ea_payment_mode}
                        </Text>
                    </View>}
                   
                    <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14), { paddingBottom: props.data.status == "0" ? 0 : 30 }]}>
                        {props.data.items && JSON.parse(props.data.items).length===0&&<Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                            Amount
                        </Text>}
                        {props.data.items && JSON.parse(props.data.items).length===0&&<Text style={gstyles.OpenSans_Regular(20, '#000000')}>
                            :{'    '}<Text style={gstyles.OpenSans_SemiBold(20, '#0276E5')}>
                                {'\u20B9'} {props.data.value.toFixed(0)}
                            </Text>
                        </Text>}
                    </View>
                    {/* <View style={[gstyles.inRow, gstyles.ms(40), gstyles.mt(14), { paddingBottom: props.data.status == "0" ? 0 : 30 }]}>
                        <Text style={gstyles.OpenSans_Regular(16, '#000000', gstyles.size('35%'))}>
                            Mode of Payment 
                        </Text>
                        <Text style={gstyles.OpenSans_Regular(20, '#000000')}>
                            :{'    '}<Text style={gstyles.OpenSans_SemiBold(20, '#0276E5')}>
                                {props.data.paymentMode}
                            </Text>
                        </Text>
                    </View>*/}

                    {props.userData && props.userData.role.handle=="redeemer-manager" && 
                    props.data.settlement_status=="unsettled" && <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#8338EC', '#3A86FF']} style={styles.settleBtnTouch}>
                        <TouchableOpacity activeOpacity={0.6}
                            style={styles.btnTouch}
                            onPress={() => { props.onClickMoveToSettled() }}
                        >
                            <Text style={gstyles.OpenSans_Bold(17, '#FFFFFF')}>
                                Move to Settled
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>}
                </View>
            </View>
        </Modal>
    );
}

export default RedeemedDetailsModal;

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
        width: '48%',
        // width: 174,
        height: 50,
        borderRadius: 4,
        alignSelf: 'center',
        marginBottom: 25
    },

    btnTouch: {
        width: '100%',
        height: 50,
        ...gstyles.centerXY,
        borderRadius: 4
    },


});