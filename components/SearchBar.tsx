import { useThemeColors } from "@/hooks/useThemeColors"
import { Image, StyleSheet, TextInput } from "react-native"
import { Row } from "./Row"

type Props = {
    value: string,
    onChange: (s: string) => void
}

export function SearchBar ({value, onChange}: Props) {
    const colors = useThemeColors()
    return (
        <Row 
            gap={8} 
            style={[styles.wrapper, {backgroundColor: colors.grayWhite}]}
        >
            <Image 
                source={require("@/assets/images/search.png")} 
                style={{width: 16, height: 16}} 
                tintColor={colors.tint}
            />
            <TextInput 
                style={styles.input} 
                onChangeText={onChange} 
                value={value} 
            />
        </Row>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderRadius: 16,
        height: 32,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 16,
        fontSize: 10,
        lineHeight: 16
    }
})