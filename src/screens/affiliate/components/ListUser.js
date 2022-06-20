import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { EmptyData } from 'src/components';

const ListUser = props => {
  const { notScroll } = props;
  const [list, setList] = useState([]);
  const pageParams = useRef({ page: 1, pageSize: 10 });

  useEffect(() => {}, []);

  const setListKey = useCallback(item => {
    return item.id;
  }, []);

  const renderEmpty = useCallback(() => {
    return <EmptyData />;
  }, []);

  const renderItem = useCallback(
    data => {
      const item = notScroll ? data : data.item;
      return <View style={styles.item} />;
    },
    [notScroll],
  );

  if (notScroll)
    return (
      <View>
        {isEmpty(list) && renderEmpty()}
        {list.map(renderItem)}
      </View>
    );
  return (
    <FlatList
      data={list}
      renderItem={renderItem}
      ListEmptyComponent={<EmptyData />}
      keyExtractor={setListKey}
    />
  );
};

ListUser.propTypes = {
  notScroll: PropTypes.bool,
};

export default React.memo(ListUser);

const styles = StyleSheet.create({
  container: {},
  item: {},
});
