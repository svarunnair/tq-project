import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {gstyles} from '../common/GlobalStyles';
import {WIDTH} from '../common/Constants';

const MenuItemRender = ({
  data,
  onChange,
  disable,
  limit,
  state,
  onCountChange,
  staticCounts,
  setStaticCounts,
  totalCount,
  setTotalCount,
}) => {
  const [counts, setCounts] = useState(data.map(item => item.count || 0));
  const [isDisabled, setIsDisabled] = useState(disable);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [show, setShow] = useState(true);
  const packageName = data.map(item => item.type);
  const maxCount = data.map(item => item.maxCount);

  useEffect(() => {
    if (counts?.length === staticCounts?.length) {
      setStaticCounts(counts);
    }
  }, [counts]);

  useEffect(() => {
    if (!state) {
      setIsMenuVisible(true);
    }
  }, [state]);

  useEffect(() => {
    onCountChange(totalCount);
    const totalCountExceeded = totalCount >= limit;
    const anyItemAtMax = data.some(
      (item, index) => counts[index] >= item.maxCount,
    );
    setIsDisabled(anyItemAtMax || totalCountExceeded);
  }, [counts, totalCount, data, limit]);

  useEffect(() => {
    setIsDisabled(false);
    setCounts(data.map(item => item.count || 0));
    if (data?.length === staticCounts?.length) {
      setTotalCount(data.reduce((sum, item) => sum + item.count, 0));
    }
  }, [data]);

  const handleReduce = (item, index) => {
    if (counts[index] > 0) {
      const newCounts = [...counts];
      newCounts[index] -= 1;
      setCounts(newCounts);
      setTotalCount(totalCount - 1);
      onChange('decrease', {...item, count: newCounts[index]});
    }
  };

  const handleAdd = (item, index) => {
    if (
      counts[index] < item.maxCount &&
      totalCount < limit &&
      totalCount < item.maxCount
    ) {
      const newCounts = [...counts];
      newCounts[index] += 1;
      setCounts(newCounts);
      setTotalCount(totalCount + 1);
      onChange('increase', {...item, count: newCounts[index]});
    }
  };

  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    const anyMaxCountGreaterThanZero = data.some(item => item.maxCount > 0);
    setShow(anyMaxCountGreaterThanZero);
  }, [data]);

  return show ? (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: WIDTH,
        display: 'flex',
        padding: 5,
      }}>
      <View
        style={{
          padding: 10,
          width: WIDTH * 0.9,
          borderWidth: 0.1,
          borderRadius: 2,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 2,
          }}
          onPress={toggleMenuVisibility}>
          <Text style={{color: 'black', fontWeight: '500'}}>
            {' '}
            {packageName?.[0]}
          </Text>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{color: 'black'}}>Drinks : {maxCount[0]}</Text>
            {isMenuVisible ? (
              <AntDesign name="up" size={20} color="black" />
            ) : (
              <AntDesign name="down" size={20} color="black" />
            )}
          </View>
        </TouchableOpacity>

        {isMenuVisible && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {data?.map((item, index) => (
              <View
                key={index}
                style={{width: '33.33%', padding: 15, paddingHorizontal: 12}}>
                <Text
                  numberOfLines={2}
                  style={[
                    gstyles.OpenSans_Medium(15, '#000'),
                    {textAlign: 'center', maxWidth: '100%', flex: 1},
                  ]}>
                  {item?.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 5,
                    paddingHorizontal: 9,
                  }}>
                  <TouchableOpacity onPress={() => handleReduce(item, index)}>
                    <AntDesign name="minuscircle" size={17} color="red" />
                  </TouchableOpacity>
                  <Text
                    style={[
                      gstyles.OpenSans_SemiBold(25, '#3A86FF'),
                      {paddingHorizontal: 15},
                    ]}>
                    {counts?.[index]}
                  </Text>
                  <TouchableOpacity
                    disabled={
                      isDisabled ||
                      counts[index] >= item.maxCount ||
                      totalCount === limit ||
                      totalCount === item.maxCount
                    }
                    onPress={() => handleAdd(item, index)}>
                    <AntDesign
                      name="pluscircle"
                      size={17}
                      color={
                        isDisabled ||
                        counts[index] >= item.maxCount ||
                        totalCount === limit ||
                        totalCount === item.maxCount
                          ? 'lightgrey'
                          : 'green'
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        <Text style={{color: 'black', marginTop: 10}}>
          Total Count: {totalCount}
        </Text>
      </View>
    </View>
  ) : null;
};

export default MenuItemRender;