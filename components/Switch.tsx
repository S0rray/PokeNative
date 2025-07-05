import { Image, Pressable, StyleSheet, View } from "react-native";

export function Switch({
    value,
    onValueChange
}) {
    return(
        <Pressable
            onPress={() => onValueChange(!value)}
            style={[
                styles.track, 
                {backgroundColor: value ? "#f5dd4b" : "#e0e0e0"}
            ]}
        >
            <View
                style={[
                styles.thumb, 
                {
                    alignSelf: value ? "flex-end" : "flex-start"
                }
                ]}
            >
                <Image
                    source={value ? require("@/assets/images/shiny.png") : require("@/assets/images/shiny_off.png")}
                    style={styles.image}
                />
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    track: {
        width: 50,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        padding: 4,
        borderWidth: 2,
        borderColor: "#e6c200"
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f3f4",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4
    },
    image: {
        width:16,
        height: 16
    }
})