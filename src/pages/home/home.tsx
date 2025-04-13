import { packageApi } from "@/api/package/package.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { calcPrice } from "@/utils/format.util";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Divider, Flex, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import Slider from "react-slick";

const { Title } = Typography;

const PackageCarousel = ({ title, data }: { title: string; data?: any[] }) => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Col span={24} style={{ marginBottom: 40 }}>
      <Flex vertical>
        <Title level={3}>{title}</Title>
        <Slider {...settings}>
          {data?.map((item) => (
            <div key={item.id}>
              <Card style={{ margin: "0 10px", height: "100%" }} hoverable>
                <Flex
                  vertical
                  align="center"
                  justify="space-between"
                  style={{ height: "100%" }}
                >
                  <Title level={4} style={{ textAlign: "center" }}>
                    {item.name}
                  </Title>

                  {/* <img
                    alt={item.name}
                    src={
                      item.image ||
                      "https://digishop.vnpt.vn/digitalShop/images/production/1743153328628Mesh%202+%20copy-100.jpg"
                    }
                    style={{
                      objectFit: "cover",
                      height: 180,
                      width: "100%",
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  /> */}

                  <Divider />

                  <Flex align="center" gap={6} style={{ minHeight: "100px" }}>
                    <p>-</p>
                    <Flex vertical>
                      {item.package_feature?.map((f) => (
                        <Fragment key={f.id}>
                          <span className="font-bold">{f.name}</span>
                          <span>{f.value}</span>
                        </Fragment>
                      ))}
                    </Flex>
                  </Flex>

                  <Divider />

                  <Title level={5}>
                    {calcPrice(item.price, item.discount).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    đ/lượt
                  </Title>

                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => navigate(`/product-detail/${item.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </Flex>
              </Card>
            </div>
          ))}
        </Slider>
      </Flex>
    </Col>
  );
};

export default function Home() {
  const { data: listHotDeal } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, 1],
    queryFn: () => packageApi.getAll({ package_category_id: 1 }),
  });

  const { data: listService } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, 2],
    queryFn: () => packageApi.getAll({ package_category_id: 2 }),
  });

  const { data: listTvCaps } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, 4],
    queryFn: () => packageApi.getAll({ package_category_id: 4 }),
  });

  return (
    <Row>
      <PackageCarousel title="🔥 Hot Deal" data={listHotDeal} />
      <PackageCarousel title="💼 Dịch vụ nổi bật" data={listService} />
      <PackageCarousel title="📺 Truyền hình cáp" data={listTvCaps} />
    </Row>
  );
}
