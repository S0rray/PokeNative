import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Row } from "../Row";
import { ThemedText } from "../ThemedText";

type Props = ViewProps & {
    name: string;
    value: number;
    color: string
}

function statShortName(name: string): string {
    return name
        .replaceAll("attack", "ATK")
        .replaceAll("defense", "DEF")
        .replaceAll("special", "S")
        .replaceAll("-", "")
        .replaceAll("speed", "SPD")
        .toUpperCase()
}

export function PokemonStat({ style, color, name, value, ...rest }): Props {
    const colors = useThemeColors()
    const sharedValue = useSharedValue(value)
    const barInnerStyle = useAnimatedStyle(() => {
        return {
            flex: sharedValue.value
        }
    })
    const barBackgroundStyle = useAnimatedStyle(() => {
        return {
            flex: 255 - sharedValue.value
        }
    })

    useEffect(() => {
        sharedValue.value = withSpring(value) 
    }, [value])

    return (
        <Row gap={8} style={[style, styles.root]} {...rest}>
            <View style={[styles.name, { borderColor: colors.grayLight }]}>
                <ThemedText style={{textAlign: "right"}} variant="subtitle3">
                    {statShortName(name)}
                </ThemedText>
            </View>
            <View style={styles.number}>
                <ThemedText>
                    {value.toString().padStart(3, "0")}
                </ThemedText>
            </View>
            <View style={styles.bar}>
                <Animated.View style={[{ backgroundColor: color }, barInnerStyle]}/>
                <Animated.View style={[styles.barBackground, { backgroundColor: color }, barBackgroundStyle]}/>
            </View>
        </Row>
    )
}

const styles = StyleSheet.create({
    root: {},
    name: {
        width: 35,
        paddingRight: 8,
        borderRightWidth: 1,
        borderStyle: "solid",
    },
    number: {
        width: 23
    },
    bar: {
        flex: 1,
        borderRadius: 20,
        height: 4,
        overflow: "hidden",
        flexDirection: "row",
    },
    barBackground: {
        opacity: 0.24
    }
})