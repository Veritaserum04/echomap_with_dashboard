export default function SidebarItem({ icon: Icon, title }) {
  return (
    <div className="sidebar-item">
      <Icon size={20} />
      <span>{title}</span>
    </div>
  );
}