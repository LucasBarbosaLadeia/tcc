import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, Eye, EyeOff, HeartPulse } from 'lucide-react';
import { loginSchema, type LoginSchema } from '@/schemas/authSchema';
import { loginRequest } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteByPerfil } from '@/constants/routes';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const storeLogin = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    try {
      const identificador = data.identificador.includes('@')
        ? data.identificador
        : data.identificador.replace(/\D/g, '');
      const result = await loginRequest(identificador, data.senha);
      storeLogin({ token: result.token, user: result.user, perfil: result.perfil });
      toast.success(`Bem-vindo, ${result.user.nome.split(' ')[0]}!`);
      navigate(getDefaultRouteByPerfil(result.perfil), { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Não foi possível fazer login. Tente novamente.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-4 shadow-lg">
            <HeartPulse className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Saúde na Mão</h1>
          <p className="text-sm text-gray-500 mt-1">Sistema Municipal de Agendamento</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Entrar na sua conta</h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* E-mail ou CPF */}
            <div>
              <label htmlFor="identificador" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail ou CPF
              </label>
              <input
                id="identificador"
                type="text"
                autoComplete="username"
                placeholder="seu@email.com ou 000.000.000-00"
                {...register('identificador')}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition
                  focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  ${errors.identificador ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
              />
              {errors.identificador && (
                <p className="mt-1 text-xs text-red-600">{errors.identificador.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('senha')}
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm outline-none transition
                    focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                    ${errors.senha ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1 text-xs text-red-600">{errors.senha.message}</p>
              )}
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition text-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Entre em contato com a recepção para obter suas credenciais.
        </p>
      </div>
    </div>
  );
}
