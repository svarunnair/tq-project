import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { app_Bg } from '../components/common/Constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginContainer from '../container/Common/Login/LoginContainer';
import ForgetPasswordContainer from '../container/Common/Login/ForgetPasswordContainer';
import MPINLoginContainer from '../container/Common/Login/MPINLoginContainer';
import ResetPasswordContainer from '../container/Common/Login/ResetPasswordContainer';
import SetMPINContainer from '../container/Common/Login/SetMPINContainer';
import EditProfileContainer from '../container/Common/Profile/EditProfileContainer';
import ValidatorTabNavigation from '../navigation/ValidatorTabNavigation';
import ChangeMpinContainer from '../container/Common/Profile/ChangeMpinContainer';
import TransactionContainer from '../container/Validator/Home/TransactionContainer';
import TransactionContainer2 from '../container/Redeemer/Home/TransactionContainer';
import RedeemerTabNavigation from '../navigation/RedeemerTabNavigation';
// import ReceptionistTabNavigation from './ReceptionistTabNav';
// import Home from '../screens/Receptionist/Home';
// import Tables from '../screens/Receptionist/Tables';
// import Profile from '../screens/Receptionist/Profile';
// import CreateCoupon from '../screens/Receptionist/CreateCoupon';
// import HomeContainerRecep from '../container/Receptionist/HomeContainerRecep';
// import CutomerDetails from '../screens/Receptionist/CutomerDetails';
// import PreviewContainer from '../screens/Receptionist/PreviewContainer';
// import GuestsContainer from '../screens/Receptionist/GuestsPage';
// import EventContainer from '../container/Receptionist/EventContainer';
// import AllotTablePage from '../screens/Receptionist/AllotTablePage';
import ProfileComponent from '../screens/Common/Profile/ProfileComponent';
import ValCouponContainer from '../container/Validator/Home/ValCouponContainer';
// import AddGuestsPage from '../components/Receptionist/AddGuestsPage';
// import Entriespage from '../screens/Receptionist/Entriespage';
// import OperationsPage from '../screens/Receptionist/OperationsPage';
import ProfileContainer from '../container/Common/Profile/ProfileContainer';
// import HistoryPage from '../screens/Receptionist/HistoryPage';
// import GuestContainer from '../container/Receptionist/GuestContainer';


const Stack = createNativeStackNavigator();

const Navigation = (props) => {

  return (
    <NavigationContainer>  
      <StatusBar
        backgroundColor={app_Bg}
        animated={true}
        barStyle="dark-content"
      />
      <Stack.Navigator
        initialRouteName={props.initialScreen}
        screenOptions={{ headerShown: false, gestureEnabled:false }}>
        {/* common screens */}
        <Stack.Screen name="LoginContainer" component={LoginContainer} />
        <Stack.Screen name="ForgetPasswordContainer" component={ForgetPasswordContainer} />
        <Stack.Screen name="MPINLoginContainer" component={MPINLoginContainer} />
        <Stack.Screen name="ResetPasswordContainer" component={ResetPasswordContainer} />
        <Stack.Screen name="SetMPINContainer" component={SetMPINContainer} />
        <Stack.Screen name="EditProfileContainer" component={EditProfileContainer} />
        

        {/* Validators Screens */}
        <Stack.Screen name="ValidatorTabNavigation" component={ValidatorTabNavigation} />       
        <Stack.Screen name="TransactionContainer" component={TransactionContainer} />
        <Stack.Screen name='ChangeMpinContainer' component={ChangeMpinContainer} />
        
        <Stack.Screen name="RedeemerTabNavigation" component={RedeemerTabNavigation} />
        {/*  */}
        <Stack.Screen name="ValCouponContainer" component={ValCouponContainer} />
        {/* <Stack.Screen name="ReceptionistTabNavigation" component={HomeContainerRecep} />
        <Stack.Screen name="EventContainer" component={EventContainer} />
        <Stack.Screen name="Preview" component={PreviewContainer} />
        <Stack.Screen name="Table" component={Tables} /> */}

        {/* <Stack.Screen name="Guests" component={GuestsContainer} />
        <Stack.Screen name="GuestContainer" component={GuestContainer} />

        <Stack.Screen name="Profile" component={ProfileComponent} />
        <Stack.Screen name="AllottablePage" component={AllotTablePage} />
        <Stack.Screen name="Create" component={CreateCoupon} />
        <Stack.Screen name="Operation" component={OperationsPage} />
        <Stack.Screen name="AddGuests" component={AddGuestsPage} />
        <Stack.Screen name="Entriespage" component={Entriespage} />
        <Stack.Screen name="CustomerDetails" component={CutomerDetails} />
        <Stack.Screen name="ProfileContainer" component={ProfileContainer} />
        <Stack.Screen name="HistoryPage" component={HistoryPage} /> */}

        <Stack.Screen name="TransactionContainer2" component={TransactionContainer2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;