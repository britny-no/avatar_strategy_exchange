import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';



type ReturnType = {
    guidesArray: any;
    // dataColumn: Array<string>;
    // refetch: () => void;
};


const useGuides = (): ReturnType => {
  const {t} = useTranslation()
  const USER_GUIDES = [
    {
        type: 'assert',
        groupTitle: t("helpCenter:guide_1_group_title"),
        title: t("helpCenter:guide_1_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_1_contents_1")}
                <br />
                <br />
                <br />
                {t("helpCenter:guide_1_contents_2")}
                <br />
                <br />
                {t("helpCenter:guide_1_contents_3")}
                <br />
                {t("helpCenter:guide_1_contents_4")}
                <br />
                {t("helpCenter:guide_1_contents_5")}
                <br />
                <br />
                {t("helpCenter:guide_1_contents_6")}
                <br />
                {t("helpCenter:guide_1_contents_7")}
                <br />
                <br />
                {t("helpCenter:guide_1_contents_8")}
                <br />
            </p>
        ),
    },
    {
        type: 'assert',
        groupTitle:  t("helpCenter:guide_2_group_title"),
        title: t("helpCenter:guide_2_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_2_contents_1")}
                <br />
                <br />
                {t("helpCenter:guide_2_contents_2")}
                <br />
                {t("helpCenter:guide_2_contents_3")}
                <br />
                <br />
                {t("helpCenter:guide_2_contents_4")}
                <br />
                {t("helpCenter:guide_2_contents_5")}
                <br />
                <br />
                {t("helpCenter:guide_2_contents_6")}
                <br />
                {t("helpCenter:guide_2_contents_7")}
                <br />
                <br />
                {t("helpCenter:guide_2_contents_8")}
                <br />
                {t("helpCenter:guide_2_contents_9")}
                <br />
            </p>
        ),
    },
    {
        type: 'assert',
        groupTitle: t("helpCenter:guide_3_group_title"),
        title: t("helpCenter:guide_3_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_3_contents_1")}
                <br />
                <br />
                {t("helpCenter:guide_3_contents_2")}
                <br />
                {t("helpCenter:guide_3_contents_3")}
                <br />
                {t("helpCenter:guide_3_contents_4")}
                <br />
                <br />
                <br />
                {t("helpCenter:guide_3_contents_5")}
                <br />
                {t("helpCenter:guide_3_contents_6")}
                <br />
                <br />
                {t("helpCenter:guide_3_contents_7")}
                <br />
            </p>
        ),
    },
    {
        type: 'assert',
        groupTitle: t("helpCenter:guide_4_group_title"),
        title: t("helpCenter:guide_4_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_4_contents_1")}
                <br />
                <br />
                {t("helpCenter:guide_4_contents_2")}
                <br />
                {t("helpCenter:guide_4_contents_3")}
                <br />
                {t("helpCenter:guide_4_contents_4")}
                <br />
                {t("helpCenter:guide_4_contents_5")}
                <br />
                <br />
                {t("helpCenter:guide_4_contents_6")}
                <br />
                {t("helpCenter:guide_4_contents_7")}
                <br />
                {t("helpCenter:guide_4_contents_8")}
                <br />
                <br />
                {t("helpCenter:guide_4_contents_9")}
                <br />
                {t("helpCenter:guide_4_contents_10")}
                <br />
                {t("helpCenter:guide_4_contents_11")}
                <br />
                {t("helpCenter:guide_4_contents_12")}
                <br />
                {t("helpCenter:guide_4_contents_13")}
                <br />
            </p>
        ),
    },
    {
        type: 'assert',
        groupTitle: t("helpCenter:guide_5_group_title"),
        title: t("helpCenter:guide_5_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_5_contents_1")}
                <br />
                {t("helpCenter:guide_5_contents_2")}
                <br />
                {t("helpCenter:guide_5_contents_3")}
                <br />
                {t("helpCenter:guide_5_contents_4")}
                <br />
                <br />
                {t("helpCenter:guide_5_contents_5")}
                <br />
                {t("helpCenter:guide_5_contents_6")}
                <br />
                <br />
                {t("helpCenter:guide_5_contents_7")}
                <br />
                <br />
                {t("helpCenter:guide_5_contents_8")}
                <br />
                <br />
                {t("helpCenter:guide_5_contents_9")}
                <br />
                {t("helpCenter:guide_5_contents_10")}
                <br />
                {t("helpCenter:guide_5_contents_11")}
                <br />
                {t("helpCenter:guide_5_contents_12")}
                <br />
            </p>
        ),
    },
    {
        type: 'order',
        groupTitle: t("helpCenter:guide_6_group_title"),
        title: t("helpCenter:guide_6_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_6_contents_1")}
                <br />
                <br />
                {t("helpCenter:guide_6_contents_2")}
                <br />
                {t("helpCenter:guide_6_contents_3")}
                <br />
                {t("helpCenter:guide_6_contents_4")}
                <br />
                <br />
                {t("helpCenter:guide_6_contents_5")}
                <br />
                {t("helpCenter:guide_6_contents_6")}
                <br />
                <br />
                {t("helpCenter:guide_6_contents_7")}
                <br />
                {t("helpCenter:guide_6_contents_8")}
                <br />
                <br />
                {t("helpCenter:guide_6_contents_9")}
                <br />
                {t("helpCenter:guide_6_contents_10")}
                <br />
                <br />
                {t("helpCenter:guide_6_contents_11")}
                <br />
                {t("helpCenter:guide_6_contents_12")}
                <br />
                {t("helpCenter:guide_6_contents_13")}
                <br />
            </p>
        ),
    },
    {
        type: 'order',
        group: t("helpCenter:guide_7_group_title"),
        title: t("helpCenter:guide_7_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_7_contents_1")}
                <br />
                <br />
                {t("helpCenter:guide_7_contents_2")}
                <br />
                <br />
                {t("helpCenter:guide_7_contents_3")}
                <br />
                <br />
                <br />
                {t("helpCenter:guide_7_contents_4")}
                <br />
                {t("helpCenter:guide_7_contents_5")}
                <br />
            </p>
        ),
    },
    {
        type: 'order',
        groupTitle: t("helpCenter:guide_8_group_title"),
        title: t("helpCenter:guide_8_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_8_contents_1")}
                <br />
                <br />
                {t("helpCenter:guide_8_contents_2")}
                <br />
                <br />
                {t("helpCenter:guide_8_contents_3")}
                <br />
                <br />
                {t("helpCenter:guide_8_contents_4")}
                <br />
                {t("helpCenter:guide_8_contents_5")}
                <br />
                <br />
                {t("helpCenter:guide_8_contents_6")}
                <br />
                {t("helpCenter:guide_8_contents_7")}
                <br />
                <br />
                {t("helpCenter:guide_8_contents_8")}
                <br />
                {t("helpCenter:guide_8_contents_9")}
                <br />
            </p>
        ),
    },
    {
        type: 'order',
        groupTitle: t("helpCenter:guide_9_group_title"),
        title: t("helpCenter:guide_9_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_9_contents_1")}
                <br />
                <br />
                {t("helpCenter:guide_9_contents_2")}
                <br />
                <br />
                {t("helpCenter:guide_9_contents_3")}
                <br />
                {t("helpCenter:guide_9_contents_4")}
                <br />
                {t("helpCenter:guide_9_contents_5")}
                <br />
                <br />
                {t("helpCenter:guide_9_contents_6")}
                <br />
                <br />
                {t("helpCenter:guide_9_contents_7")}
                <br />
                <br />
                {t("helpCenter:guide_9_contents_8")}
                <br />
                {t("helpCenter:guide_9_contents_9")}
                <br />
                {t("helpCenter:guide_9_contents_10")}
                <br />
            </p>
        ),
    },
    {
        type: 'order',
        groupTitle: t("helpCenter:guide_10_group_title"),
        title: t("helpCenter:guide_10_title"),
        writer: 'admin',
        createdAt: '2021-10-11',
        contents: (
            <p>
                {t("helpCenter:guide_10_contents_1")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_2")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_3")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_4")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_5")}
                <br />
                <br />
                <br />
                {t("helpCenter:guide_10_contents_6")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_7")}
                <br />
                <br />
                <br />
                {t("helpCenter:guide_10_contents_8")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_9")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_10")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_11")}
                <br />
                <br />
                {t("helpCenter:guide_10_contents_12")}
                <br />
            </p>
        ),
    },
];

    return {
        guidesArray: USER_GUIDES
    };
};


export default useGuides;
