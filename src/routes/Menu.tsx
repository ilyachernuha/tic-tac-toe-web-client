import { useAuth, useMenu } from "../hooks";
import {
  GameCard,
  PlayerCard,
  ReceivedInvitationCard,
  SentInvitationCard,
} from "../components";

export const Menu = () => {
  const { username, onLogout } = useAuth();

  const {
    waitingUsers,
    sentInvitations,
    receivedInvitations,
    ongoingGames,
    handleAccept,
    handleCancel,
    handleDecline,
    handleInvite,
    handlePlay,
  } = useMenu();

  const noWaitingUsers = waitingUsers.length === 0;
  const waitingUsersElements = waitingUsers.map((name) => {
    return <PlayerCard key={name} name={name} onInvite={handleInvite} />;
  });

  const noSentInvitations = sentInvitations.length === 0;
  const sentInvitationsElements = sentInvitations.map((invitation) => {
    if (invitation.status === "accepted") return;
    return (
      <SentInvitationCard
        key={invitation.id}
        invitation={invitation}
        token={invitation.inviterPlayingX ? "x" : "o"}
        onPlay={() => handlePlay(invitation.id)}
        onCancel={() => handleCancel(invitation.id)}
      />
    );
  });

  const noReceivedInvitations = receivedInvitations.length === 0;
  const receivedInvitationsElements = receivedInvitations.map((invitation) => {
    return (
      <ReceivedInvitationCard
        key={invitation.id}
        invitation={invitation}
        token={invitation.inviterPlayingX ? "o" : "x"}
        onAccept={() => handleAccept(invitation)}
        onDecline={() => handleDecline(invitation.id)}
      />
    );
  });

  const noOngoingGames = ongoingGames.length === 0;
  const ongoingGamesElements = ongoingGames.map((game) => {
    return (
      <GameCard key={game.id} game={game} onPlay={() => handlePlay(game.id)} />
    );
  });

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner container">
          <h2 className="site-header__username">Logged as {username}</h2>
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
      <div className="section container">
        <h2 className="heading-3">Ongoing games</h2>
        {noOngoingGames && <p>No ongoing games</p>}
        <ul>{ongoingGamesElements}</ul>
      </div>
    </>
  );
};
