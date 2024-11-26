import React, { useState, useRef } from 'react';
import {
    View,
    StatusBar,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    ScrollView,
    Image,
    Platform
} from 'react-native';
import { gstyles } from '../../../components/common/GlobalStyles';
import { OpenSans_Medium, WIDTH, app_Bg, HEIGHT } from '../../../components/common/Constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const ProfileComponent = (props) => {
    const navigation = useNavigation();
    const platform = Platform.OS == 'ios';
    return (
        <>
            <StatusBar
                backgroundColor={app_Bg}
                animated={true}
                barStyle="dark-content"
            />
            <View style={[gstyles.container(app_Bg)]}>
                <View style={[styles.header, (platform ? { paddingTop: HEIGHT * 0.04 } : null)]}>
                    <View style={[gstyles.inRow, { alignItems: 'center' }]}>
                        <TouchableOpacity activeOpacity={0.6}
                            onPress={() => { props.onClickBack() }}
                        >
                            <MaterialIcons name='arrow-back' size={25} color='#3F3F3F' />
                        </TouchableOpacity>
                        <Text style={gstyles.OpenSans_SemiBold(18, '#000000', gstyles.ms(15))}
                            numberOfLines={1}
                        >
                            Profile
                        </Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={[gstyles.centerXY, gstyles.mt(35)]}>

                        {props.nodeUserData && props.nodeUserData.profile_img.image_link ? 
                        <ImageBackground source={{uri:props.nodeUserData.profile_img.image_link}}
                        style={styles.profImg}
                        borderRadius={100}
                        borderColor={'#0276E5'}
                        borderWidth={1.5}/> : 
                        
                        <View style={styles.profImg}>
                            <Text style={[gstyles.OpenSans_SemiBold(45, '#000000'), { textTransform: 'uppercase' }]}>
                                {props.nodeUserData && props.nodeUserData.partner && props.nodeUserData.partner.name && props.nodeUserData.partner.name.length >= 2 ? props.nodeUserData.partner.name[0] + props.nodeUserData.partner.name[1] : ''}
                            </Text>
                        </View> } 

                        <View style={[gstyles.mt(15), gstyles.centerXY, { width: WIDTH - 90 }]}>
                            <Text numberOfLines={2}
                                style={gstyles.OpenSans_SemiBold(18, '#000000')}>
                                {props.nodeUserData && props.nodeUserData.partner.name}
                            </Text>
                            <Text numberOfLines={1}
                                style={gstyles.OpenSans_Medium(10, '#000000')}>
                                {props.nodeUserData && props.nodeUserData.role.name}
                            </Text>
                            <Text numberOfLines={1}
                                style={gstyles.OpenSans_Medium(15, '#000000', gstyles.mt(8))}>
                                {props.nodeUserData && props.nodeUserData.partner.mobile}
                            </Text>
                            <Text numberOfLines={1}
                                style={gstyles.OpenSans_Medium(15, '#000000',gstyles.mt(3))}>
                                {props.nodeUserData && props.nodeUserData.partner.email}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => props.onClickChangeMpin()} activeOpacity={1}
                            style={[gstyles.inRow, gstyles.mt(50), { alignSelf: 'center', width: WIDTH - 35 }]}>
                            <View style={{
                                width: 40, alignSelf: 'center', ...gstyles.inRow,
                                height: 40, borderRadius: 4, backgroundColor: '#FFFFFF', elevation: 0,
                                justifyContent: 'center', borderColor: '#0276E526', borderWidth: 0.3
                            }}>
                                <MaterialCommunityIcons name='account-lock' color='#000' size={22} />
                            </View>
                            <Text style={gstyles.OpenSans_SemiBold(14, '#000', gstyles.ms(15))}>
                                Change MPIN
                            </Text>
                        </TouchableOpacity>
                        {/* {console.log('role', props.userData)}
                    { props.userData.role === 'Manager' ? (<TouchableOpacity onPress={() => navigation.navigate('ManagerHomeComponent')} activeOpacity={1}
                        style={[gstyles.inRow, gstyles.mt(15), { alignSelf: 'center', width: WIDTH - 35 }]}>
                        <View style={{
                            width: 40, alignSelf: 'center', ...gstyles.inRow,
                            height: 40, borderRadius: 4, backgroundColor: '#FFFFFF', elevation: 0,
                            justifyContent: 'center', borderColor: '#0276E526', borderWidth: 0.3
                        }}>   
                            <Image source={require('../../../assets/images/role.png')} style={{height:22, width:22}}/>
                        </View>
                        <Text style={gstyles.OpenSans_SemiBold(14, '#000', gstyles.ms(15))}>
                            Change Role
                        </Text>
                    </TouchableOpacity>) : null } */}

                        {/* <View style={{ width: WIDTH - 35, height: 0.6, backgroundColor: '#0276E526', marginVertical: 0 }} /> */}
                        <TouchableOpacity onPress={() => props.onClickShareApp()} activeOpacity={1}
                            style={[gstyles.inRow, gstyles.mt(15), { alignSelf: 'center', width: WIDTH - 35 }]}>
                            <View style={{
                                width: 40, alignSelf: 'center', ...gstyles.inRow,
                                height: 40, borderRadius: 4, backgroundColor: '#FFFFFF', elevation: 0,
                                justifyContent: 'center', borderColor: '#0276E526', borderWidth: 0.3
                            }}>
                                <Ionicons name='ios-share-social' color='#000' size={22} />
                            </View>
                            <Text style={gstyles.OpenSans_SemiBold(14, '#000', gstyles.ms(15))}>
                                Share
                            </Text>
                        </TouchableOpacity>
                        {/* <View style={{ width: WIDTH - 35, height: 0.6, backgroundColor: '#0276E526', marginVertical: 0 }} /> */}
                        <TouchableOpacity onPress={() => props.onClickContact()} activeOpacity={1}
                            style={[gstyles.inRow, gstyles.mt(15), { alignSelf: 'center', width: WIDTH - 35 }]}>
                            <View style={{
                                width: 40, alignSelf: 'center', ...gstyles.inRow,
                                height: 40, borderRadius: 4, backgroundColor: '#FFFFFF', elevation: 0,
                                justifyContent: 'center', borderColor: '#0276E526', borderWidth: 0.3
                            }}>
                                <MaterialCommunityIcons name='email' color='#000' size={22} />
                            </View>
                            <Text style={gstyles.OpenSans_SemiBold(14, '#000', gstyles.ms(15))}>
                                Contact Us
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.onClickPrivery()} activeOpacity={1}
                            style={[gstyles.inRow, gstyles.mt(15), { alignSelf: 'center', width: WIDTH - 35 }]}>
                            <View style={{
                                width: 40, alignSelf: 'center', ...gstyles.inRow,
                                height: 40, borderRadius: 4, backgroundColor: '#FFFFFF', elevation: 0,
                                justifyContent: 'center', borderColor: '#0276E526', borderWidth: 0.3
                            }}>
                                <MaterialCommunityIcons name='security' color='#000' size={22} />
                            </View>
                            <Text style={gstyles.OpenSans_SemiBold(14, '#000', gstyles.ms(15))}>
                                Privecy and Policy
                            </Text>
                        </TouchableOpacity>
                        {/* <View style={{ width: WIDTH - 35, height: 0.6, backgroundColor: '#0276E526', marginVertical: 0 }} /> */}
                        <TouchableOpacity onPress={() => props.onClickLogout()} activeOpacity={1}
                            style={[gstyles.inRow, gstyles.mt(15), { alignSelf: 'center', width: WIDTH - 35 }]}>
                            <View style={{
                                width: 40, alignSelf: 'center', ...gstyles.inRow,
                                height: 40, borderRadius: 4, backgroundColor: '#FFFFFF', elevation: 0,
                                justifyContent: 'center', borderColor: '#0276E526', borderWidth: 0.3
                            }}>
                                <Feather name='log-out' color='#FF0000' size={22} />
                            </View>
                            <Text style={gstyles.OpenSans_SemiBold(14, '#FF0000', gstyles.ms(15))}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                        {/* <View style={{ width: WIDTH - 35, height: 0.6, backgroundColor: '#0276E526', marginVertical: 0 }} /> */}

                        <Text style={gstyles.OpenSans_SemiBold(12, '#0276E5', { opacity: 0.2, marginTop: 25 })}>
                            Version 2.0.8
                        </Text>

                        {/* <View style={[styles.inputBoxView, gstyles.mt(30)]}>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor={'#3F3F3F'}
                            style={styles.inputText}
                            value='Basavaraddi Mulimani'
                            editable={false}
                        />
                    </View>
                    <View style={[styles.inputBoxView, gstyles.mt(25)]}>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor={'#3F3F3F'}
                            style={styles.inputText}
                            value='99645 33375'
                            editable={false}
                            keyboardType='number-pad'
                            maxLength={10}
                        />
                    </View>
                    <View style={[styles.inputBoxView, gstyles.mt(25)]}>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor={'#3F3F3F'}
                            style={styles.inputText}
                            value='basavaraddi3522@gmail.com'
                            editable={false}
                        />
                    </View> */}
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

export default ProfileComponent;

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

    profImg: {
        ...gstyles.iconSize(109),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#00000030',
        borderWidth: 3,
        borderRadius: 100
    },

    inputBoxView: {
        width: WIDTH - 35,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#8338EC'

    },

    inputText: {
        fontFamily: OpenSans_Medium,
        fontSize: 16,
        color: '#000000',
        paddingHorizontal: 15,
        width: '100%'
    }

});