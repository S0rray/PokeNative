import { Shadows } from "@/constants/Shadows";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRef, useState } from "react";
import { Dimensions, Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { Card } from "./Card";
import { Radio } from "./Radio";
import { Row } from "./Row";
import { ThemedText } from "./ThemedText";

type Props = {
    value: "id" | "name",
    onChange: (v: "id" | "name") => void
}

const options = [
    { label: "Number", value: "id" },
    { label: "Name", value: "name" }
] as const

export function SortButton({value, onChange}: Props) {
    const buttonRef = useRef<View>(null)
    const colors = useThemeColors()
    const [isModalVisible, setModalVisibility] = useState(false)
    const [position, setPosition] = useState<null | {
        top: number;
        right: number
    }>(null);
    const onOpen = () => {
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            setPosition({
                top: y + height,
                right: Dimensions.get("window").width - x - width
            })
            setModalVisibility(true)
        })
    }
    const onClose = () => {
        setModalVisibility(false)
    }
    return (
        <>
            <Pressable onPress={onOpen}>
                <View 
                    ref={buttonRef} 
                    style={[styles.button, { backgroundColor: colors.grayWhite}]}
                >
                    <Image
                        source={
                            value === "id" ?
                                require("@/assets/images/tag.png") :
                                require("@/assets/images/text_format.png")
                        }
                        style={{
                            width: 16,
                            height: 16,
                        }}
                        tintColor={colors.tint}
                    />
                </View>
            </Pressable>
            <Modal
                animationType="fade"
                transparent
                visible={isModalVisible}    
                onRequestClose={onClose}
            >
                <Pressable 
                    style={styles.backdrop} 
                    onPress={onClose}
                />
                <View style={[styles.popup, { backgroundColor: colors.tint, ...position }]}>
                    <ThemedText
                        style={styles.title}
                        variant="subtitle2"
                        color="grayWhite"
                    >
                        Sort by:
                    </ThemedText>
                    <Card style={styles.card}>
                        {options.map(o => (
                            <Pressable key={o.value} onPress={() => onChange(o.value)}>
                                <Row gap={8}>
                                    <Radio checked={o.value === value} />
                                    <ThemedText>{o.label}</ThemedText>
                                </Row>
                            </Pressable>
                        ))}
                    </Card>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 32,
        height: 32,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center"
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    popup: {
        position: "absolute",
        width: 113,
        padding: 4,
        paddingTop: 16,
        gap: 16,
        borderRadius: 12,
        ...Shadows.dp2
    },
    title: {
        paddingLeft: 20
    },
    card: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16
    }
})