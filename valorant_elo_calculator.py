"""
Valorant Elo (RR) Calculator
Compares net RR gain between 50% and 60% win rates
assuming stable/fixed RR gains and losses per game.
"""

# Typical Valorant RR values (stable MMR)
RR_PER_WIN = 21   # average RR gained per win
RR_PER_LOSS = 19  # average RR lost per loss
GAMES = 100       # sample size

def net_rr(win_rate, games, rr_win, rr_loss):
    wins = games * win_rate
    losses = games * (1 - win_rate)
    return (wins * rr_win) - (losses * rr_loss)

wr_50 = 0.50
wr_60 = 0.60

net_50 = net_rr(wr_50, GAMES, RR_PER_WIN, RR_PER_LOSS)
net_60 = net_rr(wr_60, GAMES, RR_PER_WIN, RR_PER_LOSS)
difference = net_60 - net_50

print("=" * 45)
print("  Valorant RR Calculator")
print("=" * 45)
print(f"  RR per win:  +{RR_PER_WIN}")
print(f"  RR per loss: -{RR_PER_LOSS}")
print(f"  Games:        {GAMES}")
print("-" * 45)
print(f"  50% WR -> {GAMES * 0.5:.0f}W / {GAMES * 0.5:.0f}L  |  Net RR: {net_50:+.0f}")
print(f"  60% WR -> {GAMES * 0.6:.0f}W / {GAMES * 0.4:.0f}L  |  Net RR: {net_60:+.0f}")
print("-" * 45)
print(f"  Extra RR from 50% -> 60%:  +{difference:.0f} RR over {GAMES} games")
print(f"  That's +{difference / GAMES:.1f} RR per game on average")
print(f"  (~{difference / 100:.0f} rank-ups more, at 100 RR per rank)")
print("=" * 45)

# Also show a range of common RR values
print("\n  Sensitivity table (per 100 games):")
print(f"  {'Win RR':>7} | {'Loss RR':>8} | {'Net @50%':>9} | {'Net @60%':>9} | {'Diff':>7}")
print("  " + "-" * 50)
for rr_w, rr_l in [(20, 20), (21, 19), (22, 18), (25, 20), (20, 25)]:
    n50 = net_rr(0.50, 100, rr_w, rr_l)
    n60 = net_rr(0.60, 100, rr_w, rr_l)
    print(f"  {'+' + str(rr_w):>7} | {'-' + str(rr_l):>8} | {n50:>+9.0f} | {n60:>+9.0f} | {n60 - n50:>+7.0f}")
