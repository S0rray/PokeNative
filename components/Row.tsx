import { View, ViewProps, ViewStyle } from "react-native";

type Props= ViewProps & {
    gap?: number
    children?: React.ReactNode
}

export function Row ({style, gap, children, ...rest}: Props) {
    return (
        <View style={[rowStyle, style, gap ? {gap: gap} : undefined]} {...rest}>
            {children}
        </View>
    )
}

const rowStyle = {
    flexDirection: 'row',
    alignItems: 'center',
} satisfies ViewStyle