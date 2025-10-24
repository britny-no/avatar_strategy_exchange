// src/styled/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            black: string;
            white: string;
            blue: string;
            red: string;
            orange: string;
            bodyBackgroundColor: string;
            inputFieldColor: string;
            primaryColor: string;
            secondaryColor: string;
            normalTextColor: string;
            dimmerTextColor: string;
            tabHeaderTextColor: string;
            tabHeaderTextOnFocusColor: string;
        };

        fontSizes: {
            content: string;
            mediumContent: string;
            largeContent: string;
            tabHeader: string;
            NavigationMenu: string;
            NavigationSubMenu: string;
            orderTabMessage: string;
        };

        tabMenu: {
            tabMenuBackgroundColor: string;
            scrollBarWidth: string;
            tabMenuBorderColor: string;
            rowHeight: string;
            tabMenuHeight: string;
        };

        orderTabMenu: {
            height: string;
            divPadding: string;
            containerPadding: string;
            padding: string
        };

        landingSectionBackground: {
            white: string;
            blue: string;
            review: string;
        };
    }
}
