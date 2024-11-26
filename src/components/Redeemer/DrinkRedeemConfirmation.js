import React, { useState } from 'react';
import { View, Text, Modal, StatusBar, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { HEIGHT, WIDTH } from '../common/Constants';
import { gstyles } from '../common/GlobalStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import { showToast } from '../common/ShowToast';

const DrinkRedeemConfirmation = (props) => {
    
    const [paymentMode, setpaymentMode] = useState("");
    const _renderitems = ({item,index}) => {
        return (item.count>0 ?
            <View style={{alignContent:'center',justifyContent:'center',width:'90%',alignSelf:'center',marginTop:7}}>
                <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                    <View style={{maxWidth:'53%'}}>
                <Text numberOfLines={2} style={{color:'#000'}}>{item.name}</Text>
                </View>
                
                <View style={{justifyContent:'space-between',flexDirection:'row',width:'42%'}}>
                <Text style={{color:'#000',textAlign:'right'}}>{item.count} x {item.price}</Text>
                <Text style={{color:'#000'}}>Rs.{item.count*item.price}</Text>
                </View>
                </View>
            </View> : null
        )
    }
    return (
        <Modal
            transparent
            visible={props.isVisible}
            animationType="fade"
            onRequestClose={() => {props.setopenBreakdownmodal({visible:false,data:''})}}>
            <StatusBar
                backgroundColor={'rgba(0,0,0,0.5)'}
                barStyle="light-content"
                animated
            />
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    <View style={[gstyles.centerX, gstyles.mt(30), gstyles.mb(15)]}>
                        <Text style={gstyles.OpenSans_SemiBold(20, '#0276E5')}>
                            Breakdown 
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.6}
                        onPress={() => { props.setopenBreakdownmodal({visible:false,data:''}) }}
                        style={{ position: 'absolute', right: 30, top: 30 }}
                    >
                        <AntDesign name='close' size={25} color='#0276E5' />
                    </TouchableOpacity>

                    <ScrollView style={{paddingBottom:10}}>

                    <View style={{borderBottomColor:'#0276E5',borderBottomWidth:0,width:'90%',alignSelf:'center',paddingBottom:15}}>
                        <FlatList
                            data={props.openBreakdownmodal && props.openBreakdownmodal.data.freeDrinks}
                            renderItem={_renderitems}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    </View>
                    
                    </ScrollView>
                    
                    <View style={{alignContent:'center',justifyContent:'center',width:'90%',alignSelf:'center',
                                borderBottomColor:'#0276E5',borderBottomWidth:1,paddingBottom:15,borderTopWidth:1,borderTopColor:'#0276E5'}}>
                        <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:7,width:'90%',alignSelf:'center'}}>
                            <Text style={{color:'#000'}}>Sub Total</Text>
                            <Text style={{color:'#000'}}>Rs.{props.openBreakdownmodal.data.total}</Text>
                        </View>
                        <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:8,width:'90%',alignSelf:'center'}}>
                            <Text style={{color:'#000'}}>Coupon Amount</Text>
                            <Text style={{color:'#000'}}>Rs.{props.openBreakdownmodal.data.total - Math.round(props.openBreakdownmodal.data.excessAmout)}</Text>
                        </View>
                    </View>
                    <View style={{alignContent:'center',justifyContent:'center',width:'90%',alignSelf:'center',marginTop:7,
                                borderBottomColor:'#0276E5',borderBottomWidth:1,paddingBottom:15}}>
                        <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:7,width:'90%',alignSelf:'center'}}>
                            <Text style={{color:'#000'}}>Total payable Amount</Text>
                            <Text style={{color:'#000'}}>Rs.{Math.round(props.openBreakdownmodal.data.excessAmout)}</Text>
                        </View>
                    </View>
                    <View style={{alignContent:'center',justifyContent:'center',width:'90%',alignSelf:'center',marginTop:7,}}>
                        <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:7,width:'95%',alignSelf:'center'}}>
                            <Text style={{color:'#000'}}>Collect Balance By</Text>
                            <View style={{justifyContent:'space-between',flexDirection:'row',width:'50%'}}>
                                <TouchableOpacity onPress={()=>setpaymentMode("Cash")} style={{backgroundColor:paymentMode=="Cash" ? "#0276E5" : '#fff',borderRadius:3,borderWidth:1,borderColor:"#0276E5",paddingHorizontal:7,paddingVertical:2}}>
                                <Text style={{color:paymentMode=="Cash" ? "#fff" : '#000'}}>Cash</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setpaymentMode("Card")} style={{backgroundColor:paymentMode=="Card" ? "#0276E5" : '#fff',borderRadius:3,borderWidth:1,borderColor:"#0276E5",paddingHorizontal:7,paddingVertical:2}}>
                                <Text style={{color:paymentMode=="Card" ? "#fff" : '#000'}}>Card</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setpaymentMode("UPI")} style={{backgroundColor:paymentMode=="UPI" ? "#0276E5" : '#fff',borderRadius:3,borderWidth:1,borderColor:"#0276E5",paddingHorizontal:7,paddingVertical:2}}>
                                <Text style={{color:paymentMode=="UPI" ? "#fff" : '#000'}}>UPI</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#8338EC', '#3A86FF']} style={styles.settleBtnTouch}>
                        <TouchableOpacity onPress={() => {
                            if(paymentMode==""){
                                showToast("Please select payment mode.")
                            }else{
                                props.onCliclRedeem(props.openBreakdownmodal.data.freeDrinks,paymentMode)
                            }
                        }} activeOpacity={0.6}
                            style={styles.btnTouch}
                        >
                            <Text style={gstyles.OpenSans_Bold(15, '#FFFFFF')}>
                            Confirm
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
}

export default DrinkRedeemConfirmation;

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    modalView: {
        width: WIDTH - 35,
        maxHeight: HEIGHT - 250,
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
        width: '40%',
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

});