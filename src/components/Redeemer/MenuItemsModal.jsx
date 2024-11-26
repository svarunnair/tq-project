import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput
} from 'react-native';
import { gstyles } from '../../components/common/GlobalStyles';
import { OpenSans_Medium, WIDTH, app_Bg, HEIGHT } from '../../components/common/Constants';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from 'react-native-vector-icons/AntDesign';
import BalanceDrinks from './BalanceDrinks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showToast } from '../common/ShowToast';
import MenuItemRender from './MenuItemsRender';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../../reducers/action';
import axios from 'axios';
import { getNodeToken } from '../../services/persistData';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const MenuItemsModal = (props) => {
  const [freeDrinkss, setfreeDrinkss] = useState([]);
  const [freeDrinksLoading, setfreeDrinksLoading] = useState(false);
  const [totaladdedfreeDrinks, settotaladdedfreeDrinks] = useState(0);
  const [totaladdedfreeDrinksCount, settotaladdedfreeDrinksCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredfreeDrinks, setfilteredfreeDrinks] = useState([]);
  const [count, setCount] = useState('');
  const [value, setValue] = useState([]);
  const [postData, setPostData] = useState([]);
  const [open, setOpen] = useState(false)
  const [contFix, setCountFix] = useState(0)
  const [staticCounts, setStaticCounts] = useState([]);
  const [totalCount, setTotalCount] = useState({});
  const navigation = useNavigation()
  

  const handleValue = (val) => {
    setValue(val);
  };

  const handleCount = ({ onData }) => {
    setCount(onData);
  };

  const testCount =(e)=>{
    setCountFix(e)
  }

  useEffect(() => {
    if (props.testData && props.testData.length > 0) {
      let data = props.testData;
      for (let i = 0; i < data.length; i++) {
        data[i].count = 0;
      }
      setfreeDrinkss(data);
      setfilteredfreeDrinks(data);
      settotaladdedfreeDrinks(0);
      // 
      setStaticCounts(data);
    }
    setSearchQuery('');
  }, [props.testData, props.couponData]);


  const onSearch = (query) => {
    setSearchQuery(query);
    console.log("query",query);
    let data = filteredfreeDrinks;
    if (query && query.length > 1) {
      const searchResult = data.map(group => 
        group.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      ).filter(group => group.length > 0);
      setfreeDrinkss(searchResult && searchResult.length > 0 ? searchResult : null);
      setfreeDrinksLoading(!freeDrinksLoading);
      if (searchResult.length === 0) {
        showToast('No result found.');
      }
    } else {
      setfreeDrinkss(filteredfreeDrinks);
      setfreeDrinksLoading(!freeDrinksLoading);
    }
    const flatArray = data.flat();
    const totalCount = flatArray.reduce((acc, item) => acc + item.count, 0);
    settotaladdedfreeDrinksCount(totalCount)
  };


  const onChangeDrinksCountChange = (type, item, index) => {
    let edit = [...filteredfreeDrinks];

    edit[index].forEach((drnk) => {
      if (drnk.package === item.package && drnk._id === item._id) {
        if (type === "increase" && drnk.count < drnk.maxCount) {
          drnk.count += 1;
        }
        if (type === "decrease" && drnk.count > 0) {
          drnk.count -= 1;
        }
      }
    });
  
    setfilteredfreeDrinks(edit);
  
    let newPostData = [...postData];
  
    if (type === "increase") {
      const idExist = newPostData.some(e => e._id === item._id && e.package === item.package);
      if (idExist) {
        newPostData = newPostData.map(e => {
          if (e._id === item._id && e.package === item.package) {
            return { ...e, count: e.count + 1 };
          }
          return e;
        });
      } else {
        newPostData.push({ ...item, count: 1 });
      }
    }
  
    if (type === "decrease") {
      const idExist = newPostData.some(e => e._id === item._id && e.package === item.package);
      if (idExist) {
        newPostData = newPostData.map(e => {
          if (e._id === item._id && e.package === item.package) {
            if (e.count > 1) {
              return { ...e, count: e.count - 1 };
            } else {
              return null; 
            }
          }
          return e;
        }).filter(e => e !== null);
      }
    }
  
    setPostData(newPostData);
    const totalCount = filteredfreeDrinks.flat().reduce((sum, item) => sum + item.count, 0);
    settotaladdedfreeDrinksCount(totalCount);
  };

  const newData = postData?.map((item) => {
    return {
      _id: item._id,
      package: item.package,
      quantity: item.count
    };
  });



  useFocusEffect(
    useCallback(() => {
      return () => {
        setPostData([]);
        settotaladdedfreeDrinksCount(0)
      };
    }, [])
  );

  return (
    <>
      <RBSheet
        ref={props.freeDrinksRefRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={false}
        onClose={() => {
          // props.setcouponStatus('pending');
        }}
        animationType={'slide'}
        openDuration={250}
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
            height: 'auto',
            maxHeight: HEIGHT * 0.9,
          },
        }}>
        <View style={[gstyles.centerX, gstyles.mt(15), gstyles.mb(25)]}>
          <Text style={gstyles.OpenSans_SemiBold(20, '#0276E5')}>
            Redeem Coupon
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{position: 'absolute', right: 25, top: 15}}
          onPress={() => {
            props.freeDrinksRefRBSheet.current.close();
            // props.setcouponStatus('pending');
            // navigation.goBack()
          }}>
          <AntDesign name="close" size={25} color="#0276E5" />
        </TouchableOpacity>


        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <Text
            style={[gstyles.OpenSans_Regular(14, '#000'), {left: 10, top: 5}]}>
            Coupon ID : {props.couponData.ticket_tracking_id}
          </Text>
          <Text
            style={[
              gstyles.OpenSans_SemiBold(14, '#3A86FF'),
              {right: 10, top: 5},
            ]}>
            Balance Drinks :{props.couponData.item_balence}
          </Text>
        </View>

        <View style={styles.searchBoxView}>
          <View style={gstyles.inRow}>
            <Ionicons name="ios-search-outline" size={22} color="#3F3F3F" />
            <TextInput
            // editable={true} 
              placeholder="Search"
              placeholderTextColor={'#3F3F3F'}
              style={styles.inputSearchText}
              value={searchQuery}
              onChangeText={val => {
                onSearch(val);
              }}
            />
          </View>
        </View>

        <ScrollView>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <FlatList
             
              open={open}
              handleValue={handleValue}
              state={props.state}
              quantity={props.quantity}
              sum={props.sum}
              data={freeDrinkss}
              onData={handleCount}
              extraData={freeDrinksLoading}
              keyExtractor={(item, index) => item._id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true} 
              horizontal={false}      
              renderItem={({item, index}) => (
                <MenuItemRender
                // onCountDisable={handleDisable}
                onCountChange={testCount}
                open={open}
                handleValue={handleValue}
                state={props.state}
                  test={props.testData}
                  limit={props.couponData.item_balence}
                  sum={props.sum}
                  quantity={props.quantity}
                  drinksCount={totaladdedfreeDrinksCount}
                  key={index}
                  data={item}
                  onChange={(type, item )=> {
                    onChangeDrinksCountChange(type, item, index);
                  }}
                  // 
                  staticCounts={staticCounts?.[index]}
                  setStaticCounts={value =>
                    setStaticCounts({...staticCounts, [index]: value})
                  }
                  totalCount={totalCount?.[index]}
                  setTotalCount={value =>
                    setTotalCount(prevTotalCount => ({
                      ...prevTotalCount,
                      [index]: value,
                    }))
                  }
                />
              )}
              contentContainerStyle={{marginVertical: 5}}
            />
          </View>
        </ScrollView>

        <View
          style={[
            gstyles.centerX,
            {
              width: WIDTH - 35,
              bottom: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}>
          <View style={[styles.settleBtnTouch, {height: 50, marginBottom: 0}]}>
            {/* <Text style={gstyles.OpenSans_Bold(14, '#0276E5')}>
                            Rs.{totaladdedfreeDrinks} | {totaladdedfreeDrinksCount} Drinks
                            </Text> */}
          </View>
          <View style={[styles.settleBtnTouch, {height: 50, marginBottom: 0}]}>
            {/* {totaladdedfreeDrinks - props.couponData.ticket_balence > 0 ? 
                            <Text style={gstyles.OpenSans_Bold(14, 'red')}>
                            <Text style={gstyles.OpenSans_Bold(12, '#000')}>Collect Balance:</Text> Rs.{ totaladdedfreeDrinks - Math.round(props.couponData.ticket_balence)} 
                            </Text> : null } */}
          </View>
        </View>

        <View
          style={[
            gstyles.centerX,
            {
              width: WIDTH - 35,
              bottom: 0,
              marginRight: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}>
          <View style={styles.drinksCount}>
            <Text style={gstyles.OpenSans_Bold(16, '#0276E5')}>
              Drinks added : {totaladdedfreeDrinksCount}
            </Text>
          </View>

          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}
            colors={['#8338EC', '#3A86FF']}
            style={[
              styles.settleBtnTouch,
              {
                height: 50,
                marginBottom: 20,
                marginLeft: 5,
                opacity: contFix == 0&&totaladdedfreeDrinksCount== 0 ? 0.6 : 1,
              },
            ]}>
            <TouchableOpacity
              disabled={contFix == 0&&totaladdedfreeDrinksCount==0}
              activeOpacity={0.6}
              onPress={() => {
                props.onClickRedeemDrinks(newData);
              }}
              
              style={[styles.btnTouch, {height: 50}]}>
              <Text style={gstyles.OpenSans_Bold(16, '#FFFFFF')}>
                Redeem drinks
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </RBSheet>
    </>
  );
}
export default MenuItemsModal;

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
    drinksCount:{
      
        marginTop:10,
        display:"flex",
        alignItems:"center"
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





