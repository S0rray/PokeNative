import { Card } from "@/components/Card";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { SortButton } from "@/components/SortButton";
import { ThemedText } from "@/components/ThemedText";
import { getPokemonId } from "@/functions/pokemon";
import { useFetchQuery, useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet } from "react-native";

export default function Index() {
  const colors = useThemeColors()
  const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery('/pokemon?limit=21')
  const [search, setSearch] = useState('')
  // const pokemons = data?.pages.flatMap((page) => page.results) ?? []
  const allPokemons = useFetchQuery('/pokemon?limit=99999').data?.results.map(r => ({name: r.name, id: getPokemonId(r.url)})) ?? []
  const [sortKey, setSortKey] = useState<"id" | "name">("id")
  const filteredPokemons = [
    ...(search 
      ? allPokemons.filter(
        p => p.name.includes(search.toLowerCase()) || 
        p.id.toString() === search 
      ) 
    : allPokemons)
  ].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1))

  return (
    <RootView>
      <Row style={styles.header} gap={16} >
        <Image 
          source={require("@/assets/images/Pokeball.png")} 
          style={{ width:24, height: 24}} 
        />
        <ThemedText 
          variant="headline" 
          color="grayLight"
        >
          Pokedex
        </ThemedText>
      </Row>
      <Row gap={16} style={styles.form}>
        <SearchBar value={search} onChange={setSearch} />
        <SortButton value={sortKey} onChange={setSortKey} />
      </Row>
      <Card style={styles.body}>
        <FlatList 
          data={filteredPokemons} 
          numColumns={3}
          contentContainerStyle={[styles.gridGap, styles.list]}
          columnWrapperStyle={styles.gridGap}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={colors.tint} /> : null
          }
          onEndReached={search ? undefined : () => fetchNextPage()}
          renderItem={({item}) => (
            <PokemonCard 
              id={item.id} 
              name={item.name} 
              style={{flex: 1/3}}
            />
          )} 
          keyExtractor={(item) => item.id.toString()} 
        />
      </Card>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingBottom: 8
  },
  body: {
    flex: 1,
    marginTop: 24
  },
  gridGap: {
    gap: 8
  },
  list: {
    padding: 12
  },
  form: {
    paddingHorizontal: 12
  }
})
