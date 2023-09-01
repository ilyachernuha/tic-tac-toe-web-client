import axios from "axios";

const baseUrl = new URL(import.meta.env.VITE_API_URL).origin;

export async function getServerStatus() {
  try {
    await axios.get(`${baseUrl}/check_availability`);
    return true;
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return [true, null];
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
    console.error(error);
    return [true, null];
  }
}

export async function startWaiting(token: string) {
  try {
    await axios.post(
      `${baseUrl}/start_waiting`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    return [false, true];
  } catch (error) {
    console.error(error);
    return [true, null];
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
    console.error(error);
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
    console.error(error);
    return [true, null];
  }
}

export async function sendInvitation(
  { inviter, inviterPlayingX, gridSize, winningLine }: Invitation,
  token: string
) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/invite`,
      {
        invited: inviter,
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    return data?.game_state;
  } catch (error) {
    console.error(error);
    return null;
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
    console.error(error);
    return [true, null];
  }
}
