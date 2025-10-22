import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails

} from "@mui/material"
import {
  makeStyles
} from "@mui/styles"
import {
  ExpandMore

} from "@mui/icons-material"
// import { makeStyles } from '@material-ui/core/styles';
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useGuides from "@/hooks/useGuides"
import useScreenSize from '@/hooks/useScreenSize';

const UserGuides = () => {
    const {t} = useTranslation()
    const {guidesArray} = useGuides()
    const {isMobile} = useScreenSize();

    return (
        <Wrap $isMobile={isMobile}>
            <div className="title">{t("helpCenter:user_guides")}</div>
            <div className="contents">
              {guidesArray.map((data, i) => {
                const { title, contents } = data;
                return (
                  <AccordionWrap key={title} 
                  // className={classes.root}
                  >
                    <AccordionSummary
                      focusVisibleClassName={"focus"}
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <div className="list-title">{title}</div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="contents">
                        {contents}
                      </div>
                    </AccordionDetails>
                  </AccordionWrap>

                );
              })}
            </div>
        </Wrap>
    );
};

export default UserGuides;

const Wrap = styled.div<{$isMobile: boolean}>`
    display: flex;
    flex-direction: column;
    width: 100%;
    .title {
      font-weight: bold;
      font-size: 26px;
      line-height: 35px;
      color: #383838;
      margin-bottom: 46px;
    }
    .list-title {
      font-size: 16px;
      line-height: 22px;
      color: #606060;
    }
    .contents{
      font-weight: normal;
      font-size: 14px;
      line-height: 19px;
      color: #B0B0B0;
    }
  ${({$isMobile}) => $isMobile && css`
      .title {
        font-weight: bold;
        font-size: 18px;
        line-height: 26px;
        text-align: center;
      }
      .list-title {
        font-size: 14px;
        line-height: 19px;
      }
      .contents {
        font-size: 13px;
        line-height: 18px;
      }
  `}
`;

const AccordionWrap = styled(Accordion)`
  border: 1px solid #DDDDDD;
  box-sizing: border-box;
  border-radius: 6px !important;
  margin: 5px 0;
  box-shadow: unset !important;
  &.Mui-expanded {
    border: 1px solid #FFAB2E;
  }
  &.MuiAccordion-root:before {
    background-color: rgba(0,0,0,0) !important;
  }
`
