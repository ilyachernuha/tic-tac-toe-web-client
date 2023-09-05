import { useAuth, useMenu } from "../../hooks";
import {
  PlayerCard,
  ReceivedInvitationCard,
  SentInvitationCard,
} from "../../components/";

interface Menu {
  setGame: ({}: Game) => void;
}

export const Menu = ({ setGame }: Menu) => {
  const { username, onLogout } = useAuth();

  const {
    waitingUsers,
    sentInvitations,
    receivedInvitations,
    handleAccept,
    handleCancel,
    handleDecline,
    handleInvite,
    handlePlay,
  } = useMenu({
    setGame,
  });

  const noWaitingUsers = waitingUsers.length === 0;
  const waitingUsersElements = waitingUsers.map((name) => {
    return <PlayerCard key={name} name={name} onInvite={handleInvite} />;
  });

  const noSentInvitations = sentInvitations.length === 0;
  const sentInvitationsElements = sentInvitations.map((invitation) => {
    if (invitation.status === "cancelled") return;
    return (
      <SentInvitationCard
        key={invitation.id}
        invitation={invitation}
        token={invitation.inviterPlayingX ? "x" : "o"}
        onPlay={() => handlePlay(invitation)}
        onCancel={() => handleCancel(invitation.id)}
      />
    );
  });

  const noReceivedInvitations = receivedInvitations.length === 0;
  const receivedInvitationsElements = receivedInvitations.map((invitation) => (
    <ReceivedInvitationCard
      key={invitation.id}
      invitation={invitation}
      token={invitation.inviterPlayingX ? "o" : "x"}
      onAccept={() => handleAccept(invitation)}
      onDecline={() => handleDecline(invitation.id)}
    />
  ));

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner container">
          <h2 className="heading-3">Logged as {username}</h2>
          <button className="button" data-type="accent" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>
      <div className="section container">
        <h2 className="heading-3">Players Online</h2>
        {noWaitingUsers && <p>No waiting users</p>}
        <ul>{waitingUsersElements}</ul>
      </div>
      <div className="section container">
        <h2 className="heading-3">Sent Invitations</h2>
        {noSentInvitations && <p>No sent invitations</p>}
        <ul>{sentInvitationsElements}</ul>
      </div>
      <div className="section container">
        <h2 className="heading-3">Received Invitations</h2>
        {noReceivedInvitations && <p>No received invitations</p>}
        <ul>{receivedInvitationsElements}</ul>
      </div>
    </>
  );
};
