import axios from "axios";

const baseUrl = new URL(import.meta.env.VITE_API_URL).origin;

export async function getServerStatus(): Promise<boolean> {
  try {
    await axios.get(`${baseUrl}/check_availability`);
    return true;
  } catch (error) {
    return false;
  }
}

export async function createUser(username: string, password: string) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/create_user`,
      {},
      {
        auth: {
          username,
          password,
        },
      }
    );
    return [false, data?.token];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_NETWORK") {
        return ["Server is offline", null];
      }
      return [error?.response?.data?.detail, null];
    }
    return ["Unexpected error", null];
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/login`,
      {},
      {
        auth: {
          username,
          password,
        },
      }
    );
    return [false, data?.token];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_NETWORK") {
        return ["Server is offline", null];
      }
      return [error?.response?.data?.detail, null];
    }
    return ["Unexpected error", null];
  }
}

export async function startWaiting(token: string) {
  try {
    await axios.post(
      `${baseUrl}/start_waiting`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    return false;
  } catch (error) {
    return true;
  }
}

export async function stopWaiting(token: string) {
  try {
    await axios.post(
      `${baseUrl}/stop_waiting`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    return [false, true];
  } catch (error) {
    return [true, null];
  }
}

export async function getWaitingUsers(token: string) {
  try {
    const { data } = await axios.get(`${baseUrl}/waiting_users`, {
      headers: { Authorization: "Bearer " + token },
    });
    return [false, data?.waiting_users];
  } catch (error) {
    return [true, null];
  }
}

export async function sendInvitation(
  { invited, inviterPlayingX, gridSize, winningLine }: Invitation,
  token: string
) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/invite`,
      {
        invited: invited,
        grid_properties: {
          size: gridSize,
          winning_line: winningLine,
        },
        inviter_playing_x: inviterPlayingX,
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    return [false, data.invitation_id];
  } catch (error) {
    return [true, null];
  }
}

export async function pollInvitationStatus(
  invitationId: string,
  token: string
) {
  try {
    const { data } = await axios.get(`${baseUrl}/poll_invitation_status`, {
      headers: { Authorization: "Bearer " + token },
      params: { invitation_id: invitationId },
    });
    return [false, { status: data.status, gameId: data?.game_id }];
  } catch (error) {
    return [true, null];
  }
}

export async function getSentInvitations(token: string) {
  try {
    const { data } = await axios.get(`${baseUrl}/get_sent_invitations`, {
      headers: { Authorization: "Bearer " + token },
    });
    const invitations = data.sent_invitations.map(
      ({
        invitation_id,
        inviter_playing_x,
        grid_properties,
        status,
        invited,
        game_id,
      }: any) => {
        return {
          id: invitation_id,
          inviterPlayingX: inviter_playing_x,
          gridSize: grid_properties.size,
          winningLine: grid_properties.winning_line,
          status: status,
          invited: invited,
          gameId: game_id,
        };
      }
    );
    return [false, invitations];
  } catch (error) {
    return [true, null];
  }
}

export async function getReceivedInvitations(token: string) {
  try {
    const { data } = await axios.get(`${baseUrl}/poll_invitations`, {
      headers: { Authorization: "Bearer " + token },
    });
    const invitations = data.invitations.map(
      ({ invitation_id, inviter, inviter_playing_x, grid_properties }: any) => {
        return {
          id: invitation_id,
          inviter: inviter,
          inviterPlayingX: inviter_playing_x,
          gridSize: grid_properties.size,
          winningLine: grid_properties.winning_line,
        };
      }
    );
    return [false, invitations];
  } catch (error) {
    return [true, null];
  }
}

export async function acceptInvitation(invitationId: string, token: string) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/respond_invitation`,
      {
        invitation_id: invitationId,
        response: "accept",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    return [false, data?.game_id];
  } catch (error) {
    return [true, null];
  }
}

export async function declineInvitation(invitationId: string, token: string) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/respond_invitation`,
      {
        invitation_id: invitationId,
        response: "decline",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    return [false, data?.detail];
  } catch (error) {
    return [true, null];
  }
}

export async function cancelInvitation(invitationId: string, token: string) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/cancel_invitation`,
      {},
      {
        headers: { Authorization: "Bearer " + token },
        params: { invitation_id: invitationId },
      }
    );
    return [false, data?.detail];
  } catch (error) {
    return [true, null];
  }
}

export async function makeMove(gameId: string, cell: string, token: string) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/make_move`,
      {
        game_id: gameId,
        cell: cell,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    return [null, data?.game_state];
  } catch (error) {
    return [true, null];
  }
}

export async function pollGame(gameId: string, token: string) {
  try {
    const { data } = await axios.get(`${baseUrl}/poll_game`, {
      headers: { Authorization: "Bearer " + token },
      params: { game_id: gameId },
    });
    return [
      false,
      {
        newMove: data.new_move,
        state: data.game_state,
        cell: data?.cell,
      },
    ];
  } catch (error) {
    return [true, null];
  }
}

const api = {
  acceptInvitation,
  cancelInvitation,
  declineInvitation,
  getReceivedInvitations,
  getSentInvitations,
  getWaitingUsers,
  sendInvitation,
  startWaiting,
  stopWaiting,
  makeMove,
  pollGame,
};

export default api;
