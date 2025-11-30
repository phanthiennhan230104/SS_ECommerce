export default function LiveUsersIndicator({ count = 12847 }) {
  return (
    <div className="live-users">
      <div className="live-users-badge">
        <div className="user-avatars">
          <div className="user-avatar user-avatar-1"></div>
          <div className="user-avatar user-avatar-2"></div>
          <div className="user-avatar user-avatar-3"></div>
        </div>

        <span className="live-users-text">
          <span className="live-users-count">{count.toLocaleString()}</span>{" "}
          users shopping now
        </span>
      </div>
    </div>
  );
}
