import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { Switch } from "@/components/Switch";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { basePokemonStats, formatSize, formatWeight, getPokemonArtwork, getPokemonShinyArtwork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function Pokemon() {
    const colors = useThemeColors()
    const params = useLocalSearchParams() as {id: string}
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", {id: params.id})
    const id = parseInt(params.id, 10)
    const { data: species } = useFetchQuery("/pokemon-species/[id]", {id: params.id})
    const mainType = pokemon?.types?.[0].type.name
    const colorType = mainType ? Colors.type[mainType] : colors.tint
    const types = pokemon?.types ?? []
    const bio = species?.flavor_text_entries
        ?.find(({language}) => language.name === 'en')
        ?.flavor_text.replaceAll("\n", ". ")
    
    const stats = pokemon?.stats ?? basePokemonStats
    const onImagePress = async () => {
        const cry = pokemon?.cries.latest
        if (!cry) {
            return
        }
        const {sound} = await Audio.Sound.createAsync({
            uri: cry
        }, {shouldPlay: true})
        sound.playAsync()
    }

    const onPrevious = () => {
        router.replace({pathname: '/pokemon/[id]', params: {id: Math.max(id - 1, 1)}})
    }
    const onNext = () => {
        router.replace({pathname: '/pokemon/[id]', params: {id: Math.min(id + 1, 1025)}})
    }

    const isFirst = id === 1
    const isLast = id === 1025

    const [shiny, setShiny] = useState('')
    console.log("shiny :", shiny)
    const artwork = () => {
        if(shiny) {
            return getPokemonShinyArtwork(id)
        }
        return getPokemonArtwork(id)
    }
    
    console.log("artwork :", artwork())

    return (
        <RootView backgroundColor={colorType} >
            <View>
                <Image 
                    style={styles.pokeball}
                    source={require("@/assets/images/pokeball_big.png")} 
                />
                <Row style={styles.header}>
                    <Row gap={8}>
                        <Pressable onPress={router.back}>
                            <Image 
                                source={require("@/assets/images/arrow_back.png")} 
                                style={{
                                    width: 32,
                                    height: 32,
                                    tintColor: "#fff",
                                }}
                            />
                        </Pressable>
                        <ThemedText 
                            color="grayWhite" 
                            variant="headline" 
                            style={{textTransform: "capitalize"}}
                        >
                            { pokemon?.name }
                        </ThemedText>
                    </Row>
                    <Row gap={8}>
                        <Switch
                            value={shiny}
                            onValueChange={setShiny}
                        />
                        <ThemedText color="grayWhite" variant="subtitle2">
                            #{params.id.padStart(3, "0")}
                        </ThemedText>
                    </Row>
                </Row>
                
                <Card style={[styles.card, { overflow: "visible" }]}>
                    
                    {/* ArtWork */}
                    <Row style={styles.imageRow}>
                        {isFirst ? <View style={{width: 24, height: 24}}></View> : <Pressable onPress={onPrevious}>
                            <Image 
                                style={{width: 24, height: 24, tintColor: "#fff"}} 
                                source={require("@/assets/images/chevron_left.png")}
                            />
                        </Pressable>}
                        <Pressable onPress={onImagePress}>
                            <Image 
                                style={styles.artwork}
                                source={{ uri: artwork()}}
                            />
                        </Pressable>
                        {isLast ? <View style={{width: 24, height: 24}}></View> : <Pressable onPress={onNext}>
                            <Image 
                                style={{width: 24, height: 24, tintColor: "#fff"}} 
                                source={require("@/assets/images/chevron_right.png")}
                            />
                        </Pressable>}
                    </Row>

                    <Row style={{justifyContent: "center", height: 20}} gap={16}>
                        {types.map(type => (
                            <PokemonType name={type.type.name} key={type.type.name} />
                        ))}
                    </Row>

                    {/* About */}
                    <ThemedText variant="subtitle1" style={{color: colorType}}>
                        About
                    </ThemedText>
                    <Row style={{ width: "100%" }} >
                        <PokemonSpec 
                            style={{
                                borderStyle: "solid",
                                borderRightWidth: 1,
                                borderColor: colors.grayLight
                            }}
                            title={formatWeight(pokemon?.weight)} 
                            description="Weight" 
                            image={require("@/assets/images/weight.png")} 
                        />
                        <PokemonSpec 
                            style={{
                                borderStyle: "solid",
                                borderRightWidth: 1,
                                borderColor: colors.grayLight
                            }}
                            title={formatSize(pokemon?.height)} 
                            description="Size" 
                            image={require("@/assets/images/straighten.png")} 
                        />
                        <PokemonSpec 
                            title={pokemon?.moves
                                .slice(0, 2)
                                .map(m => m.move.name)
                                .join("\n")} 
                            description="Moves"
                        />
                    </Row>
                    <ThemedText>{bio}</ThemedText>

                    {/* Stats */}
                    <ThemedText variant="subtitle1" style={{color: colorType}}>
                        Base stats
                    </ThemedText>
                    <View style={{ alignSelf: "stretch" }}>
                        {stats.map(stat => (
                            <PokemonStat 
                                key={stat.stat.name} 
                                name={stat.stat.name} 
                                value={stat.base_stat} 
                                color={colorType}
                            />
                        ))}  
                    </View>
                </Card>
            </View>
        </RootView>
    )
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: "space-between",
    },
    pokeball: {
        width: 208,
        height: 208,
        opacity: 1,
        position: "absolute",
        right: 9,
        top: 8
    },
    imageRow: {
        position: "absolute",
        top: -144,
        zIndex: 2,
        justifyContent: "space-between",
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    artwork: {
        width: 200,
        height: 200,
    },
    body: {},
    card: {
        marginTop: 144,
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 20,
        gap: 16,
        alignItems: "center"
    }
})