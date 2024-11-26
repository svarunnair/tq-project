import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView, FlatList, TextInput
} from 'react-native';
import { gstyles } from '../../components/common/GlobalStyles';
import { OpenSans_Medium, WIDTH, app_Bg, HEIGHT } from '../../components/common/Constants';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from 'react-native-vector-icons/AntDesign';
import BalanceDrinks from './BalanceDrinks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showToast } from '../common/ShowToast';

const BalanceDrinksModal = (props) => {

    const [freeDrinkss, setfreeDrinkss] = useState([]);
    const [freeDrinksLoading, setfreeDrinksLoading] = useState(false);
    const [totaladdedfreeDrinks, settotaladdedfreeDrinks] = useState(0);
    const [totaladdedfreeDrinksCount, settotaladdedfreeDrinksCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredfreeDrinks, setfilteredfreeDrinks] = useState([]);


    useEffect(() => {
        console.log("true",props.freeDrinks && props.freeDrinks.length > 0) ;
        if (props.freeDrinks && props.freeDrinks.length > 0) {
            let data = props.freeDrinks;
        
            for (let i = 0; i < data.length; i++) {
                data[i].count = 0;
            }
            setfreeDrinkss(data);
            setfilteredfreeDrinks(data);
            settotaladdedfreeDrinks(0);
        }
        setSearchQuery("");
    }, [props.freeDrinks,props.couponData]);


   

    const onSearch=(query)=>{
        setSearchQuery(query);
        console.log(query);
        let data=filteredfreeDrinks;
        if(query && query.length>1){
            const searchResult = data.filter(function (item) {
            return ( 
              (item['name'].toLowerCase().includes(query.toLowerCase()))
            )
          });
        //   console.log("asdasdasda",searchResult && searchResult.length>0);

        //   console.log("....search result,,,,,,,,",searchResult);
          setfreeDrinkss(searchResult && searchResult.length>0 ? searchResult : filteredfreeDrinks);
          setfreeDrinksLoading(!freeDrinksLoading);
          if(searchResult.length==0){
            showToast("No result found.")
          }
           
        }else{
            setfreeDrinkss(filteredfreeDrinks);
            setfreeDrinksLoading(!freeDrinksLoading);
        }
        let totalcount = 0;
        let totalAmount = 0;
        for (let i = 0; i < data.length; i++) {
            totalcount = totalcount + data[i].count;
            if(data[i].count>=1){
                totalAmount = totalAmount + (data[i].price * data[i].count);
            }
        }
        settotaladdedfreeDrinks(totalAmount);
        settotaladdedfreeDrinksCount(totalcount)
        console.log("search...........",freeDrinkss.length,freeDrinksLoading,"aaaaa",freeDrinkss);
      }


    const onChangeDrinksCountChange = (type, item, index) => {

        // console.log('............indexCheckInDrinks..((()))..........',type, item, index);
      
        let data = freeDrinkss;
        let data2 = filteredfreeDrinks;
        
        if (type == 'increase') {
            data[index].count = data[index].count + 1;
        } else if (type == 'decrease') {
            data[index].count = data[index].count - 1;
        }
        
        setfreeDrinkss(data);
        // setfilteredfreeDrinks(data2);
        setfreeDrinksLoading(!freeDrinksLoading);
        let totalcount = 0;
        let totalAmount = 0;
       
        for (let i = 0; i < data2.length; i++) {
            totalcount = totalcount + data2[i].count;
            if(data2[i].count>=1){
                totalAmount = totalAmount + (data2[i].price * data2[i].count);
            }
        }
        
        settotaladdedfreeDrinks(totalAmount);
        settotaladdedfreeDrinksCount(totalcount)
        // console.log("onChangeDataIn BY Drinks",data);
        // console.log("..data2222222...",data2);
    };

    return (
        <>
            <RBSheet
                ref={props.byDrinksRefRBSheet}
                closeOnDragDown={false}
                closeOnPressMask={false}
                onClose={() => {
                    // props.setcouponStatus('pending')
                }}
                animationType={'slide'}
                openDuration={250}
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
                        height: 'auto',
                        maxHeight : HEIGHT * 0.9,
                    }
                }}
            >
                <View style={[gstyles.centerX, gstyles.mt(15), gstyles.mb(25)]}>
                    <Text style={gstyles.OpenSans_SemiBold(20, '#0276E5')}>
                        Redeem Coupon
                    </Text>
                </View>
                <TouchableOpacity activeOpacity={0.6}
                    style={{ position: 'absolute', right: 25, top: 15 }}
                    onPress={()=>{
                        props.byDrinksRefRBSheet.current.close()
                        // props.setcouponStatus('pending');
                    }}
                >
                    <AntDesign name='close' size={25} color='#0276E5' />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text style={[gstyles.OpenSans_Regular(14, '#000'), { left: 10, top: 5 }]}>Coupon ID : {props.couponData.ticket_tracking_id}</Text>
                    <Text style={[gstyles.OpenSans_SemiBold(14, '#3A86FF'), { right: 10, top: 5 }]}>Balance : Rs.{Math.round(props.couponData.ticket_balence)}</Text>
                </View>

                <View style={styles.searchBoxView}>
                    <View style={gstyles.inRow}>
                        <Ionicons name='ios-search-outline' size={22} color='#3F3F3F' />
                        <TextInput
                            placeholder='Search'
                            placeholderTextColor={'#3F3F3F'}
                            style={styles.inputSearchText}
                            value={searchQuery}
                            onChangeText={(val)=>{onSearch(val)}}
                        />
                    </View>
                </View>
                
                <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                    <FlatList
                        data={freeDrinkss}
                        extraData={freeDrinksLoading}
                        keyExtractor={(item, index) => item._id} 
                        showsVerticalScrollIndicator={false}
                        numColumns={3}
                        horizontal={false}
                        renderItem={({ item, index }) => (
                            <BalanceDrinks
                                key={index}
                                data={item}
                                onChange={(type) => { onChangeDrinksCountChange(type, item, index) }}
                            />
                        )}
                        contentContainerStyle={{marginVertical:5}}
                    />
                </View>
                
                </ScrollView>
                
                <View style={[gstyles.centerX, { width: WIDTH - 35, bottom:0, flexDirection: 'row',justifyContent:'space-between' }]}>
                    <View style={[styles.settleBtnTouch, { height: 50, marginBottom:0 }]}>
                            <Text style={gstyles.OpenSans_Bold(14, '#0276E5')}>
                            Rs.{totaladdedfreeDrinks} | {totaladdedfreeDrinksCount} Drinks
                            </Text>
                    </View>
                    <View style={[styles.settleBtnTouch, { height: 50, marginBottom:0 }]}>
                    {totaladdedfreeDrinks - props.couponData.ticket_balence > 0 ? 
                            <Text style={gstyles.OpenSans_Bold(14, 'red')}>
                            <Text style={gstyles.OpenSans_Bold(12, '#000')}>Collect Balance :</Text> Rs.{ totaladdedfreeDrinks - Math.round(props.couponData.ticket_balence)} 
                            </Text> : null }
                    </View>
                </View>

                <View style={[gstyles.centerX, { width: WIDTH - 35, bottom:0, marginRight: 5, flexDirection: 'row',justifyContent:"center" }]}>
                <LinearGradient
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        colors={['#8338EC', '#3A86FF']}
                         style={[styles.settleBtnTouch, { height: 50,marginBottom:20, marginLeft: 5,
                            padding: 1}]}
                    >
                        <TouchableOpacity activeOpacity={0.6} onPress={()=>{
                            // props.freeDrinksRefRBSheet.current.close()
                            props.byDrinksRefRBSheet.current.close()
                            props.refRBSheet.current.open();
                            }}
                            style={[styles.btnTouch,{
                                backgroundColor: '#ffffff'}]}
                        >
                            <Text style={gstyles.OpenSans_Bold(16, '#0276E5')}>
                                Redeem bill
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#8338EC', '#3A86FF']} style={[styles.settleBtnTouch, { height: 50,marginBottom:20, marginLeft: 5,opacity:totaladdedfreeDrinks==0 ? 0.6 : 1}]}
                    >
                        <TouchableOpacity disabled={totaladdedfreeDrinks==0} activeOpacity={0.6} 
                        onPress={()=>{props.onClickRedeemFreeDrinks(filteredfreeDrinks,totaladdedfreeDrinks,totaladdedfreeDrinks - props.couponData.ticket_balence,props.setcouponStatus('pending')) }}
                            style={[styles.btnTouch, { height: 50 }]}
                        >
                            <Text style={gstyles.OpenSans_Bold(16, '#FFFFFF')}>
                                Redeem drinks
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

            </RBSheet>
        </>
    )
}
export default BalanceDrinksModal;

const styles = StyleSheet.create({

    settleBtnTouch: {
        width: '49.9%',
        height: 42,
        borderRadius: 4,
        ...gstyles.centerXY,
    },

    unSettleBtnTouch: {
        backgroundColor: '#FFFFFF',
        borderColor: '#0276E5',
        borderWidth: 1
    },

    btnTouch: {
        width: '100%',
        height: 48,
        ...gstyles.centerXY,
        borderRadius: 4
    },

    searchBoxView: {
        width: WIDTH - 35,
        alignSelf: 'center',
        height: 45,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#0276E5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10
    },

    inputSearchText: {
        fontFamily: OpenSans_Medium,
        fontSize: 16,
        color: '#000000',
        marginLeft: 12,
        width: '85%'
    },
})