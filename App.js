import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import CoinItems from "./components/CoinItems";

const App = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    const data = await res.json();
    setCoins(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#141414" />
      <View style={styles.header}>
        <Text style={styles.title}>CryptoMarket</Text>
        <TextInput
          style={styles.searchInput}
          onChangeText={(text) => setSearch(text)}
          placeholder="Search a Coin"
          placeholderTextColor="#858585"
        />
      </View>
      <FlatList
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await loadData();
          setRefreshing(false);
        }}
        style={styles.list}
        data={coins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        )}
        renderItem={({ item }) => {
          return <CoinItems coin={item} />;
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    alignItems: "center",
    flex: 1,
  },
  title: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 20,
  },
  list: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    marginBottom: 10,
  },
  searchInput: {
    color: "#fff",
    borderBottomColor: "#4657ce",
    borderBottomWidth: 1,
    width: "40%",
    textAlign: "center",
  },
});

export default App;
