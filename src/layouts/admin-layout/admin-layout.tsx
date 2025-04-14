import { Button, Layout, Menu, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { MedicineBoxOutlined } from "@ant-design/icons";
import logoVNPT from "@/assets/logo-vnpt-4.png";
import { LogoutOutlined } from "@ant-design/icons"; // Import icon đăng xuất
import { PoweroffOutlined } from "@ant-design/icons"; // Import icon tắt nguồn

export default function AdminLayout() {
  if (sessionStorage.getItem("USER") !== "ADMIN") {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const handleSidebarItem = (url: string) => {
    navigate(url);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh", overflowY: "auto" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={240}
        style={{
          background: "#001529", // Màu nền tối
          borderRight: "1px solid #555", // Màu đường viền bên phải
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
          <img
            src={logoVNPT}
            alt="VNPT Logo"
            className="logo"
            style={{
              width: "100px",
              height: "auto",
              borderRadius: "50%", // Tạo kiểu dáng tròn cho logo
              transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động cho logo
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            } // Phóng to logo khi hover
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Trở về kích thước ban đầu khi không hover
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(e) => handleSidebarItem(e.key)}
          defaultSelectedKeys={["dashboard"]}
          items={[
            {
              key: "dashboard",
              icon: <MedicineBoxOutlined />,
              label: "Trang chủ",
            },
            {
              key: "package-category",
              icon: <MedicineBoxOutlined />,
              label: "Gói danh mục",
            },
            {
              key: "package",
              icon: <MedicineBoxOutlined />,
              label: "Gói",
            },
            {
              key: "package-feature",
              icon: <MedicineBoxOutlined />,
              label: "Gói tính năng",
            },
            {
              key: "subscription-duration",
              icon: <MedicineBoxOutlined />,
              label: "Gói tháng",
            },
            {
              key: "guest-order",
              icon: <MedicineBoxOutlined />,
              label: "Hóa đơn khách hàng",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Thêm bóng cho header
          }}
        >
          <div></div>
          <Button
            onClick={handleLogout}
            className="bg-black text-green-500 border border-black rounded-2xl px-6 py-2 transition-all duration-300 ease-in-out hover:bg-blue-500 hover:text-black focus:outline-none"
            icon={<PoweroffOutlined />} // Thêm icon tắt nguồn
          >
            Đăng xuất
          </Button>
        </Header>

        <Content
          style={{
            margin: "12px 12px",
            background: colorBgContainer,
            padding: "20px", // Thêm padding cho phần nội dung
            borderRadius: "8px", // Bo tròn các góc của content
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: "#001529",
            color: "#fff", // Đổi màu chữ footer cho tương thích với nền tối
            padding: "10px",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
