import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { gstyles } from '../common/GlobalStyles';
import { OpenSans_Medium, WIDTH, app_Bg, HEIGHT } from '../common/Constants';

const BalanceDrinks = ({ data, onChange , disable}) => {

    // console.log(".///////////......data.................",data);
    return (
        data.count>0  ? (
        <View style={{ width:WIDTH/3, alignItems:'center',justifyContent:'flex-start',height:100}}>
            <Text numberOfLines={2} style={[gstyles.OpenSans_Medium(15, '#000'), { textAlign: 'center',maxWidth:WIDTH/3-10}]}>{data.name}</Text>
            <Text numberOfLines={1} style={[gstyles.OpenSans_Bold(12, '#000'), { textAlign: 'center',maxWidth:WIDTH/3-10}]}>Rs.{data.price}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' , top:4}}>
                <TouchableOpacity onPress={()=>onChange("decrease")}>
                    <AntDesign name="minuscircle" size={20} color="red" />
                </TouchableOpacity>
                <Text style={[ gstyles.OpenSans_SemiBold(25, '#3A86FF'), {paddingHorizontal: 15} ]}>{data.count}</Text>
                <TouchableOpacity disabled={disable} onPress={()=>onChange("increase")}>
                    <AntDesign name="pluscircle" size={20} color={disable ? "lightgrey" : "green"} />
                </TouchableOpacity>
            </View>
        </View> ) : 
        (<View style={{ width:WIDTH/3,alignItems:'center',justifyContent:'flex-start',height:100}}>
            <Text numberOfLines={2} style={[gstyles.OpenSans_Medium(15, '#000'), { textAlign: 'center',maxWidth:WIDTH/3-10}]}>{data.name}</Text>
            <Text numberOfLines={1} style={[gstyles.OpenSans_Bold(12, '#000'), { textAlign: 'center',maxWidth:WIDTH/3-10}]}>Rs.{data.price}</Text>
            <View style={{ alignItems: 'center' ,opacity:disable ? 0.3 : 1}}>
                <TouchableOpacity disabled={disable} onPress={()=>onChange("increase")} style={{paddingHorizontal:17,paddingVertical:3,borderColor:'#3A86FF',borderWidth:1,borderRadius:4,top:10}}>
                <Text style={[ gstyles.OpenSans_SemiBold(12, '#3A86FF')]}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>)
    );
};

export default BalanceDrinks;
