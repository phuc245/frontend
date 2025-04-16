import { Card, Col, Flex, Row, Tabs, TabsProps, Button } from "antd";
import {
  ArrowLeftOutlined,
  MobileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Info from "@/pages/home/profile/_components/info";
import { useQuery } from "@tanstack/react-query";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { userApi } from "@/api/user/user.api";
import OrderHistory from "@/pages/home/profile/_components/order-history";
import SubscriptionHistory from "@/pages/home/profile/_components/subscription-history";
import { useNavigate } from "react-router-dom"; // ✅ Thêm dòng này

export default function Profile() {
  const navigate = useNavigate(); // ✅ Khởi tạo navigate
  const { data: me } = useQuery({
    queryKey: [TANSTACK_KEY.ME],
    queryFn: () => userApi.getMe(),
  });

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      children: <Info />,
    },
    {
      key: "2",
      label: "Lịch sử hoá đơn",
      children: <OrderHistory />,
    },
    {
      key: "3",
      label: "Dịch vụ gói cước",
      children: <SubscriptionHistory />,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          style={{ marginBottom: 12 }}
        >
          Quay lại trang chủ
        </Button>
      </Col>
      <Col span={6}>
        <Card>
          <Flex vertical gap={6} align="center">
            <span className="text-2xl font-semibold">
              {me?.first_name} {me?.last_name}
            </span>
            <span>Thành viên từ 01/2024</span>
            <span>
              <MobileOutlined /> {me?.phone_number}
            </span>
            <span>
              <UserOutlined /> {me?.email}
            </span>
          </Flex>
        </Card>
      </Col>
      <Col span={18}>
        <Card>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Card>
      </Col>
    </Row>
  );
}
