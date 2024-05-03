import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "./constants";

interface Styles {
    container: {
        width: number;
    };
    searchTitle: {
        fontFamily: string;
        fontSize: number;
        color: string;
    };
    noOfSearchedJobs: {
        marginTop: number;
        fontFamily: string;
        fontSize: number;
        color: string;
    };
    loaderContainer: {
        marginTop: number;
    };
    footerContainer: {
        marginTop: number;
        justifyContent: 'center';
        alignItems: 'center';
        flexDirection: 'row';
        gap: number;
    };
    paginationButton: {
        width: number;
        height: number;
        borderRadius: number;
        justifyContent: 'center';
        alignItems: 'center';
        backgroundColor: string;
    };
    paginationImage: {
        width: number;
        height: number;
        tintColor: string;
    };
    paginationTextBox: {
        width: number;
        height: number;
        borderRadius: number;
        justifyContent: 'center';
        alignItems: 'center';
        backgroundColor: string;
    };
    paginationText: {
        fontFamily: string;
        fontSize: number;
        color: string;
    };
}

const styles = StyleSheet.create<Styles>({
    container: {
        width: "100%",
    },
    searchTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
        color: COLORS.primary,
    },
    noOfSearchedJobs: {
        marginTop: 2,
        fontFamily: FONT.medium,
        fontSize: SIZES.small,
        color: COLORS.primary,
    },
    loaderContainer: {
        marginTop: SIZES.medium
    },
    footerContainer: {
        marginTop: SIZES.small,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    paginationButton: {
        width: 30,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.tertiary
    },
    paginationImage: {
        width: '60%',
        height: '60%',
        tintColor: COLORS.white
    },
    paginationTextBox: {
        width: 30,
        height: 30,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    paginationText: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
        color: COLORS.primary
    }
});

export default styles;
