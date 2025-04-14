import { packageCategoryApi } from "@/api/package-category/package-category.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Divider, Flex, Input, Row, Typography } from "antd";
import { useState } from "react";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { packageApi } from "@/api/package/package.api";
import { useNavigate } from "react-router-dom";
import { calcPrice } from "@/utils/format.util";

const { Title, Text } = Typography;

export default function Product() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cateId, setCateId] = useState(0);
  const navigate = useNavigate();
  const { data: packageCategories } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ALL],
    queryFn: () => packageCategoryApi.getAll(),
  });

  const { data: packages } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, cateId],
    queryFn: () => packageApi.getAll({ package_category_id: cateId }),
  });

  const filteredData = packages?.filter((packagee) =>
    packagee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryImageMap: Record<number, string> = {
    2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmzhCpIEw4ctmNJRJSZjoPmu2234mK_9V0w&s",
    1: "https://digishop.vnpt.vn/digitalShop/images/production/1737606576027Chuan-100.jpg",
    3: "https://digishop.vnpt.vn/digitalShop/images/production/1743251187165Mesh%202+%20copy_2-100.jpg",
  };

  const defaultImage =
    "https://digishop.vnpt.vn/digitalShop/images/production/1743223180156Home%203-100.jpg";

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <div className="mb-10"></div>
        <Title style={{ color: "#60B5FF" }}>Các dịch vụ chúng tôi</Title>
      </Col>
      <Col span={24}>
        <Flex justify="space-between">
          <Flex align="center" gap={5}>
            {packageCategories?.map((item) => (
              <span
                key={item.id}
                onClick={() => setCateId(item.id)}
                className={`${
                  cateId === item.id &&
                  "border-b-2 border-b-sky-500 text-sky-500"
                } cursor-pointer hover:text-sky-500 px-2`}
              >
                {item.name}
              </span>
            ))}
          </Flex>
        </Flex>
      </Col>
      <Divider />
      <Col
        span={24}
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <span className="text-sky-500 text-xl">
          Tìm kiếm gói cước theo tên gói cước và số thuê bao
        </span>
        <Input
          size="large"
          placeholder="Tìm kiếm gói"
          value={searchTerm}
          style={{ width: "50%" }}
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          size="large"
          style={{ width: "30%" }}
          shape="round"
          type="primary"
        >
          Tìm kiếm
        </Button>
      </Col>
      {filteredData?.map((item) => (
        <Col span={12} key={item.id}>
          <Card bordered={false} style={{ height: "auto" }}>
            <Flex direction="column" gap={10} style={{ height: "100%" }}>
              <Flex gap={10} style={{ flex: 1 }}>
                <img
                  alt={item.name}
                  src={
                    categoryImageMap[item.package_category.id] || defaultImage
                  }
                  className="min-h-[170px]"
                  width={200}
                />
                <Flex vertical gap={6} style={{ flex: 1 }}>
                  <Title level={4} style={{ color: "#ff2a68" }}>
                    {item.name}
                  </Title>
                  <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {calcPrice(item.price, item.discount).toLocaleString(
                      "vi-VN"
                    ) + "đ/lượt"}
                  </Text>
                  {item.package_feature?.map((feature, index) => (
                    <p key={index}>
                      - {feature.name} ({feature.value}).
                    </p>
                  ))}
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    block
                    onClick={() => navigate(`/product-detail/${item.id}`)}
                    style={{
                      width: "50%", // Giới hạn chiều rộng button là 50% chiều rộng thẻ
                      marginTop: "auto", // Đảm bảo nút luôn ở dưới
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
