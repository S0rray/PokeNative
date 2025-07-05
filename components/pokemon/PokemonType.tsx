import { Colors } from "@/constants/Colors"
import { View, ViewStyle } from "react-native"
import { ThemedText } from "../ThemedText"

type Props = {
    name: keyof (typeof Colors)["type"]
}

export function PokemonType({ name }: Props) {
    console.log("PokemonType", name)
    return (
        <View style={[rootStyle, {backgroundColor: Colors.type[name]}]}>
            <ThemedText 
                color="grayWhite" 
                variant="subtitle3"
                style={{ textTransform: "capitalize" }}
            >
                {name}
            </ThemedText>
        </View>
    )
}

const rootStyle = {
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
} satisfies ViewStyle