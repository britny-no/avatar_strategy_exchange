import BaseTable from "../../common/BaseTable";
import useNinetySix from "../../../hooks/useNinetySix";

const style = {
  maxWidth: 2400,
  maxHeight: 486,
  rowHeight: 47,
};

export default function Index() {
  const { data, dataColumn } = useNinetySix();

  const orderConcludedProps = {
    data,
    dataColumn,
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #dbdbdb",
          maxWidth: style.maxWidth,
          borderRadius: "6px",
        }}
      >
        <div>96번 실시간 주문접수 테스팅</div>
        <BaseTable {...orderConcludedProps} {...style} />
      </div>
  
    </>
  );
}

