import { View, Text } from "react-native";
import { FC } from "react";
import { GoogleInputProps } from "@/types/type";

const GoogleTextInput: FC<GoogleInputProps> = ({
  icon,
  containerStyle,
  handlePress,
  initialLocation,
  textInputBackgroundColor,
}) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
      <Text>Search</Text>
    </View>
  );
};

export default GoogleTextInput;