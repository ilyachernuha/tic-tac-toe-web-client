import axios from "axios";

const baseUrl = new URL(import.meta.env.VITE_API_URL).origin;

export async function getServerStatus(): Promise<void> {
  try {
    await axios.get(`${baseUrl}/check_availability`);
  } catch (error) {
    throw new Error();
  }
}

export async function createUser(
  username: string,
  password: string
): Promise<string> {
  try {
    const { data } = await axios.post(
      `${baseUrl}/create_user`,
      {},
      {
        auth: {
          username: username,
          password: password,
        },
      }
    );
    return data?.token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error?.response?.data?.detail);
    } else {
      throw new Error("Unexpected error");
    }
  }
}

export async function loginUser(
  username: string,
  password: string
): Promise<string> {
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
    return data?.token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error?.response?.data?.detail);
    } else {
      throw new Error("Unexpected error");
    }
    // if (axios.isAxiosError(error)) {
    //   if (error.code === "ERR_NETWORK") {
    //     return ["Server is offline", null];
    //   }
    //   return [error?.response?.data?.detail, null];
    // }
    // return ["Unexpected error", null];
  }
}

export async function startWaiting(token: string): Promise<void> {
  try {
    await axios.post(
      `${baseUrl}/start_waiting`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
  } catch (error) {
    throw new Error();
  }
}

export async function stopWaiting(token: string): Promise<void> {
  try {
    await axios.post(
      `${baseUrl}/stop_waiting`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
  } catch (error) {
    throw new Error();
  }
}

export async function getWaitingUsers(token: string): Promise<string[]> {
  try {
    const { data } = await axios.get(`${baseUrl}/waiting_users`, {
      headers: { Authorization: "Bearer " + token },
    });
    return data?.waiting_users;
  } catch (error) {
    throw new Error();
  }
}

export async function sendInvitation(
  { invited, inviterPlayingX, gridSize, winningLine }: Invitation,
  token: string
): Promise<Invitation["id"]> {
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
    return data?.invitation_id;
  } catch (error) {
    throw new Error();
  }
}

export async function pollInvitationStatus(
  invitationId: string,
  token: string
): Promise<{ status: Invitation["status"]; gameId: string }> {
  try {
    const { data } = await axios.get(`${baseUrl}/poll_invitation_status`, {
      headers: { Authorization: "Bearer " + token },
      params: { invitation_id: invitationId },
    });
    return { status: data?.status, gameId: data?.game_id };
  } catch (error) {
    throw new Error();
  }
}

export async function getSentInvitations(token: string): Promise<Invitation[]> {
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
    return invitations;
  } catch (error) {
    throw new Error();
  }
}

export async function getReceivedInvitations(
  token: string
): Promise<Invitation[]> {
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
    return invitations;
  } catch (error) {
    throw new Error();
  }
}

export async function acceptInvitation(
  invitationId: string,
  token: string
): Promise<Game["id"]> {
  try {
    const { data } = await axios.post(
      `${baseUrl}/respond_invitation`,
      {
        invitation_id: invitationId,
        response: "accept",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    return data?.game_id;
  } catch (error) {
    throw new Error();
  }
}

export async function declineInvitation(
  invitationId: string,
  token: string
): Promise<void> {
  try {
    await axios.post(
      `${baseUrl}/respond_invitation`,
      {
        invitation_id: invitationId,
        response: "decline",
      },
      { headers: { Authorization: "Bearer " + token } }
    );
  } catch (error) {}
}

export async function cancelInvitation(
  invitationId: string,
  token: string
): Promise<void> {
  try {
    await axios.post(
      `${baseUrl}/cancel_invitation`,
      {},
      {
        headers: { Authorization: "Bearer " + token },
        params: { invitation_id: invitationId },
      }
    );
  } catch (error) {}
}

export async function makeMove(
  gameId: string,
  cell: string,
  token: string
): Promise<Game["state"]> {
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
    throw new Error();
  }
}

export async function pollGame(
  gameId: Game["id"],
  token: string
): Promise<PollGameResponse> {
  try {
    const { data } = await axios.get(`${baseUrl}/poll_game`, {
      headers: { Authorization: "Bearer " + token },
      params: { game_id: gameId },
    });
    return {
      newMove: data?.new_move,
      state: data?.game_state,
      cell: data?.cell,
    };
  } catch (error) {
    throw new Error();
  }
}

export async function getGame(gameId: string, token: string): Promise<Game> {
  try {
    const { data } = await axios.get(`${baseUrl}/get_full_game_state`, {
      headers: { Authorization: "Bearer " + token },
      params: { game_id: gameId },
    });
    return {
      id: gameId,
      opponent: data.opponent,
      grid: data.grid_state,
      winningLine: data.grid_properties.winning_line,
      token: data.you_playing_x ? "x" : "o",
      state: data.status,
      isYourTurn: data.your_turn,
      gridSize: data.grid_state.length,
    };
  } catch (error) {
    throw new Error();
  }
}

export async function playAgain(
  gameId: string,
  isPlayAgain: boolean,
  token: string
): Promise<any> {
  try {
    const { data } = await axios.post(
      `${baseUrl}/play_again`,
      {
        game_id: gameId,
        play_again: isPlayAgain,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    return {
      status: data?.status,
      gameId: data?.new_game_id,
    };
  } catch (error) {
    throw new Error();
  }
}

export async function pollPlayAgain(
  gameId: string,
  token: string
): Promise<any> {
  try {
    const { data } = await axios.get(`${baseUrl}/poll_play_again_status`, {
      headers: { Authorization: "Bearer " + token },
      params: { game_id: gameId },
    });
    return {
      status: data?.play_again_status,
      gameId: data?.next_game_id,
    };
  } catch (error) {
    throw new Error();
  }
}

export async function getGames(token: string): Promise<Game[]> {
  try {
    const { data } = await axios.get(`${baseUrl}/get_ongoing_games`, {
      headers: { Authorization: "Bearer " + token },
    });
    return data?.ongoing_games.map(
      ({
        game_id,
        opponent,
        you_playing_x,
        play_again_scheme,
        grid_properties: { size, winning_line },
      }: any) => {
        return {
          id: game_id,
          opponent: opponent,
          mode: play_again_scheme,
          token: you_playing_x ? "x" : "o",
          gridSize: size,
          winningLine: winning_line,
        };
      }
    );
  } catch (error) {
    throw new Error();
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
  getGame,
  playAgain,
  pollPlayAgain,
  getGames,
};

export default api;
