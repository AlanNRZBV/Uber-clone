import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermissions, setHasPermissions] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`,
  );

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });
      setUserLocation({
        latitude: location.coords.latitude!,
        longitude: location.coords.longitude!,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };
    requestLocation();
  }, [setUserLocation]);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };
  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };
  return (
    <SafeAreaView>
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  className="w-40 h-40"
                  alt="No recent rides found"
                  source={images.noResult}
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl font-JakartaExtraBold">
                Welcome,&nbsp;
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4 " />
              </TouchableOpacity>
            </View>
            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />
            <></>
            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Current Location
            </Text>
            <View className="flex flex-row bg-transparent items-center h-[300px]">
              <Map />
            </View>
            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
