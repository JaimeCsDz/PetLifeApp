import { View } from "react-native"
import { SafeAreaView } from "react-native"
import { ScrollView } from "react-native"
import { Text } from "react-native-paper"

export const InicioScreen = () => {
    return(
        <>
        <SafeAreaView>
            <ScrollView>
                <Text>Hola Mundo</Text>
            </ScrollView>
        </SafeAreaView>
        </>
    )
}