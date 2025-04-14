import { cartItemApi } from "@/api/cart-item/cart-item.api";
import { packageApi } from "@/api/package/package.api";
import { subscriptionDurationApi } from "@/api/subscription-duration/subscription-duration.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { queryClient } from "@/query-client";
import { CreateCartItemRequestType } from "@/types/cart-item/cart-item.type";
import { calcPriceWithSubscriptionDuration } from "@/utils/format.util";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Carousel,
  Divider,
  Flex,
  message,
  Space,
  Col,
} from "antd";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Query Packagee
  const { data: packagee } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ONE, id],
    queryFn: () => packageApi.getOneById(Number(id)),
  });
  // Query Subscription Duration
  const { data: subscriptionDurations } = useQuery({
    queryKey: [TANSTACK_KEY.SUBSCRIPTION_DURATION_ALL],
    queryFn: () => subscriptionDurationApi.getAll(),
  });
  // Query List Packages
  const { data: listPackages } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, packagee?.package_category.id],
    queryFn: () =>
      packageApi.getAll({ package_category_id: packagee?.package_category.id }),
  });

  const [activeSubscriptionDuration, setActiveSubscriptionDuration] =
    useState(0);

  useEffect(() => {
    if (subscriptionDurations) {
      setActiveSubscriptionDuration(subscriptionDurations[0].id);
    }
  }, [subscriptionDurations]);

  const { mutate: addCartItem } = useMutation({
    mutationFn: (body: CreateCartItemRequestType) => cartItemApi.create(body),
  });

  const handleAddCartItem = () => {
    if (!activeSubscriptionDuration) return;

    addCartItem(
      {
        package_id: Number(id),
        subscription_duration_id: activeSubscriptionDuration,
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.CART_ITEM_ALL],
          });
          message.success("Thêm vào giỏ hàng thành công");
        },

        onError: () => {
          message.error("Gói này đã tồn tại trong giỏ hàng của bạn!");
        },
      }
    );
  };

  const categoryImageMap: Record<number, string> = {
    2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmzhCpIEw4ctmNJRJSZjoPmu2234mK_9V0w&s",
    1: "https://digishop.vnpt.vn/digitalShop/images/production/1737606576027Chuan-100.jpg",
    3: "https://digishop.vnpt.vn/digitalShop/images/production/1743251187165Mesh%202+%20copy_2-100.jpg",
  };

  const defaultImage =
    "https://digishop.vnpt.vn/digitalShop/images/production/1743223180156Home%203-100.jpg";

  return (
    <>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card style={{ padding: "24px" }}>
          <Flex gap={12}>
            <img
              src={
                categoryImageMap[packagee?.package_category.id ?? 0] ||
                defaultImage
              }
              alt={packagee?.name}
              width={200}
            />
            <Flex vertical gap={4} flex={1}>
              <span>{packagee?.name}</span>
              {(() => {
                const selectedDuration = subscriptionDurations?.find(
                  (item) => item.id === activeSubscriptionDuration
                );

                const months = selectedDuration?.months || 1;
                const discount = selectedDuration?.discount_percentage || 0;
                const pricePerMonth = packagee?.price || 0;

                const totalBeforeDiscount = pricePerMonth * months;
                const totalAfterDiscount =
                  totalBeforeDiscount * (1 - discount / 100);

                return (
                  <>
                    <Flex gap={24}>
                      {/* Tổng tiền trước giảm */}
                      <span>
                        {totalBeforeDiscount.toLocaleString("vi-VN") + "đ"}
                      </span>
                      {/* Discount theo thời hạn */}
                      <span>{Math.round(discount)}%</span>
                    </Flex>

                    {/* Giá sau khi đã giảm */}
                    <span className="text-[#E7007F]">
                      {totalAfterDiscount.toLocaleString("vi-VN") + "đ"}
                    </span>
                  </>
                );
              })()}
              {/* <Flex gap={24}>
                <span>
                  {Number(packagee?.price).toLocaleString("vi-VN") + "đ"}
                </span>
                <span>{packagee?.discount}%</span>
              </Flex>
              <span className="text-[#E7007F]">
                {calcPriceWithSubscriptionDuration(
                  packagee,
                  subscriptionDurations?.find(
                    (item) => item.id === activeSubscriptionDuration
                  )
                ).toLocaleString("vi-VN") + "đ"}
              </span> */}
              <Divider style={{ margin: "12px 0" }} />
              {packagee?.package_feature?.map((item) => (
                <Flex gap={4} key={item.id}>
                  <span className="text-[#E7007F]">✓</span>
                  <span>{item.name}</span>
                </Flex>
              ))}
              <Flex gap={12}>
                {subscriptionDurations?.map((item) => (
                  <Button
                    key={item.id}
                    color="primary"
                    variant={
                      activeSubscriptionDuration === item.id
                        ? "solid"
                        : "outlined"
                    }
                    onClick={() => setActiveSubscriptionDuration(item.id)}
                  >
                    {item.months} tháng
                  </Button>
                ))}
              </Flex>
              <Button
                type="primary"
                style={{ width: "50%", marginTop: "auto" }}
                shape="round"
                onClick={handleAddCartItem}
              >
                Thêm vào giỏ hàng ngay
              </Button>
            </Flex>
          </Flex>
        </Card>
        <Card style={{ padding: "24px" }}>
          <Flex vertical gap={12}>
            <span className="text-2xl text-sky-500 font-semibold">
              Thông tin chi tiết
            </span>
            <span>
              <div>
                <p>
                  <strong>1. Ưu đãi gói cước</strong>
                </p>
                <ul style={{ paddingLeft: 20 }}>
                  <li>Đường truyền Internet tốc độ 300 Mbps</li>
                  <li>
                    Trang bị miễn phí thiết bị ONT 2 băng tần trong suốt thời
                    gian sử dụng
                  </li>
                  <li>
                    Lắp đặt nhanh chóng, chăm sóc và hỗ trợ khách hàng 24/7
                  </li>
                </ul>

                <p>
                  <strong>2. Cước đấu nối hòa mạng</strong>
                </p>
                <ul style={{ paddingLeft: 20 }}>
                  <li>
                    Cước đấu nối hòa mạng áp dụng cho thuê bao đăng ký mới dịch
                    vụ cho Khách hàng cá nhân, Hộ gia đình: 300.000 VNĐ/thuê bao
                    (đã bao gồm VAT)
                  </li>
                </ul>

                <p>
                  <strong>3. Khu vực áp dụng</strong>
                </p>
                <ul style={{ paddingLeft: 20 }}>
                  <li>Áp dụng tại nội thành Hà Nội, TP. HCM</li>
                </ul>

                <p>
                  <strong>4. Tổng đài hỗ trợ</strong>
                </p>
                <ul style={{ paddingLeft: 20 }}>
                  <li>
                    Để được hỗ trợ về dịch vụ internet và truyền hình, Quý khách
                    vui lòng liên hệ
                    <strong> 1800 1166</strong> (miễn phí)
                  </li>
                </ul>
              </div>
            </span>
          </Flex>
        </Card>
        <Col span={24} style={{ marginTop: 32 }}>
          <Flex vertical>
            <span className="text-2xl font-semibold text-sky-500">
              Gói cước khác
            </span>
            <Slider
              dots={false}
              infinite={false}
              speed={500}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay={false}
              swipeToSlide
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 3 } },
                { breakpoint: 768, settings: { slidesToShow: 2 } },
                { breakpoint: 480, settings: { slidesToShow: 1 } },
              ]}
            >
              {listPackages
                ?.filter((pkg) => pkg.id !== Number(id))
                .map((item) => (
                  <div key={item.id}>
                    <Card
                      style={{ margin: "0 10px", height: "100%" }}
                      hoverable
                    >
                      <Flex
                        vertical
                        align="center"
                        justify="space-between"
                        style={{ height: "100%" }}
                      >
                        <img
                          alt={item.name}
                          src={
                            categoryImageMap[item.package_category.id] ||
                            defaultImage
                          }
                          style={{
                            objectFit: "cover",
                            height: 160,
                            width: "100%",
                            borderRadius: 8,
                            marginBottom: 10,
                          }}
                        />

                        <span className="text-xl font-semibold text-center">
                          {item.name}
                        </span>

                        <Divider />

                        <Flex
                          align="center"
                          gap={6}
                          style={{ minHeight: "100px" }}
                        >
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

                        <span className="text-lg">
                          {Number(item.price).toLocaleString("vi-VN")} đ/lượt
                        </span>

                        <Button
                          type="primary"
                          size="middle"
                          onClick={() => {
                            navigate(`/product-detail/${item.id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
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
      </Space>
    </>
  );
}
