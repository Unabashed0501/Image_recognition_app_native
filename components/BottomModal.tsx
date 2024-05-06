import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export default function BottomModal() {
	const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

	const bottomSheetRef = useRef<BottomSheet>(null);

	const handleClosePress = () => bottomSheetRef.current?.close();
	const handleOpenPress = () => bottomSheetRef.current?.expand();
	const handleCollapsePress = () => bottomSheetRef.current?.collapse();
	const snapeToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
	const renderBackdrop = useCallback(
		(props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
		[]
	);

	return (
		<View style={styles.container}>
			<Button title="Open" onPress={handleOpenPress} />
			{/* <Button title="Close" onPress={handleClosePress} />
			<Button title="Collapse" onPress={handleCollapsePress} />
			<Button title="Snap To 0" onPress={() => snapeToIndex(0)} />
			<Button title="Snap To 1" onPress={() => snapeToIndex(1)} />
			<Button title="Snap To 2" onPress={() => snapeToIndex(2)} /> */}

			<BottomSheet
				ref={bottomSheetRef}
				index={0}
				snapPoints={snapPoints}
				enablePanDownToClose={true}
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: '#1d0f4e' }}
				backdropComponent={renderBackdrop}
			>
				{/* <View style={styles.contentContainer}>
					<Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
					<Button title="Close" onPress={handleClosePress} />
				</View> */}
			</BottomSheet>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center'
	},
	containerHeadline: {
		fontSize: 24,
		fontWeight: '600',
		padding: 20,
		color: '#fff'
	}
});